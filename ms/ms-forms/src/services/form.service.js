const { CustomError } = require('../helpers/errors/errors');
const redis = require('../helpers/utils/redis-client');
const { handleSequelizeError } = require('../helpers/utils/sequelize-error-handler');
const { isEmpty } = require('../helpers/utils/utils');
const filesService = require('./files.service'); // ajusta ruta si es necesario

const { sequelize, Form, Question, QuestionOption, QuestionOptionImage } = require('../models');
const removeSnakeCaseDuplicates = require('../helpers/utils/camel-case');
const { Op } = require('sequelize');

class FormService {

  async create(formData) {
    try {
      const form = sequelize.transaction(async (t) => {
        const form = await Form.create({
          title: formData.title,
          description: formData.description,
          isPublic: formData.isPublic,
          userId: formData.userId,
        }, { transaction: t });

        if (formData.questions && formData.questions.length > 0) {
          for (const q of formData.questions) {
            const question = await Question.create({
              formId: form.id,
              questionText: q.questionText,
              type: q.type,
              required: q.required || false,
              order: q.order,
            }, { transaction: t });

            if (q.options && q.options.length > 0) {
              for (const o of q.options) {
                const option = await QuestionOption.create({
                  questionId: question.id,
                  text: o.text,
                }, { transaction: t });

                if (o.images && o.images.length > 0) {
                  for (const img of o.images) {
                    await QuestionOptionImage.create({
                      optionId: option.id,
                      imagePath: img.imagePath,
                    }, { transaction: t });
                  }
                }
              }
            }
          }
        }
        return form;
      });
      redis.set(`forms:${form.id}`, JSON.stringify(form), 'EX', 1800);
      redis.del(`forms:user:${form.userId}`);
      return form;
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  // Obtener formulario por id con toda la info anidada
  async findById(id, userId) {
    try {
      const cacheKey = `forms:${id}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }

      const form = await Form.findByPk(id, {
        include: [{
          model: Question,
          as: 'questions',
          include: [{
            model: QuestionOption,
            as: 'options',
            include: [{
              model: QuestionOptionImage,
              as: 'images',
            }]
          }]
        }]
      });

      if (isEmpty(form)) {
        throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
      } else {
        // redis.set(cacheKey, JSON.stringify(form), 'EX', 3600);
      }

      if (form.userId !== userId) {
        throw new CustomError('¡Ups! Elemento no permitido', 403);
      }

      return removeSnakeCaseDuplicates(form.get({ plain: true }), { parseDates: true });
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  // Actualizar formulario completo (reemplazando preguntas, opciones, imágenes)
  async update(id, formData, userId) {

    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) {
        throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
      }
      if (userId && form.userId !== userId) {
        throw new CustomError('¡Ups! Elemento no permitido', 403);
      }

      await sequelize.transaction(async (t) => {
        const form = await Form.findByPk(id, { transaction: t });
        if (isEmpty(form)) {
          throw new Error('Form not found');
        }

        await form.update({
          title: formData.title,
          description: formData.description,
          isPublic: formData.isPublic,
        }, { transaction: t });

        // Borrar preguntas relacionadas y todo lo anidado para insertar nuevos

        await sequelize.query(
          `DELETE FROM questionask.question_option_images
           WHERE option_id IN (
             SELECT qo.id FROM questionask.question_options qo
             JOIN questionask.questions q ON qo.question_id = q.id
             WHERE q.form_id = :formId
           )`,
          { replacements: { formId: id }, transaction: t }
        );

        // 1. Obtener IDs de preguntas para ese formId
        const questions = await Question.findAll({
          where: { formId: id },
          attributes: ['id'],
          raw: true,
          transaction: t,
        });
        const questionIds = questions.map(q => q.id);

        // 2. Eliminar opciones asociadas (si hay preguntas)
        if (questionIds.length > 0) {
          await QuestionOption.destroy({
            where: { questionId: { [Op.in]: questionIds } },
            transaction: t,
          });
        }

        // 3. Eliminar las preguntas
        await Question.destroy({
          where: { formId: id },
          transaction: t,
        });

        // Insertar nuevas preguntas, opciones e imágenes (igual que en create)
        if (formData.questions && formData.questions.length > 0) {
          for (const q of formData.questions) {
            const question = await Question.create({
              formId: form.id,
              questionText: q.questionText,
              type: q.type,
              required: q.required || false,
              order: q.order,
            }, { transaction: t });

            if (q.options && q.options.length > 0) {
              for (const o of q.options) {
                const option = await QuestionOption.create({
                  questionId: question.id,
                  text: o.text,
                }, { transaction: t });

                if (o.images && o.images.length > 0) {
                  for (const img of o.images) {
                    await QuestionOptionImage.create({
                      optionId: option.id,
                      imagePath: img.imagePath,
                    }, { transaction: t });
                  }
                }
              }
            }
          }
        }
        return form;
      });

      const formSearched = await Form.findByPk(form.id, {
        include: [{
          model: Question,
          as: 'questions',
          include: [{
            model: QuestionOption,
            as: 'options',
            include: [{
              model: QuestionOptionImage,
              as: 'images',
            }]
          }]
        }]
      });

      redis.set(`forms:${formSearched.id}`, JSON.stringify(formSearched), 'EX', 3600);
      redis.del(`forms:user:${formSearched.userId}`);

      return formSearched;
    } catch (error) {
      console.log(error);
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  async delete(id, userId) {
    try {

      await sequelize.transaction(async (t) => {
        const form = await Form.findByPk(id, { transaction: t });
        if (isEmpty(form)) {
          throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
        }
        if (userId && form.userId !== userId) {
          throw new CustomError('¡Ups! Elemento no permitido', 403);
        }

        filesService.deleteFormFiles(userId, form.id);

        await form.destroy({ transaction: t });
        return true;
      });

      // Invalidar caché
      redis.del(`forms:${id}`);
      redis.del(`forms:user:${userId}`);

      return { message: `Formulario con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  async findAll(userId, withQuestions = false) {
    try {
      const cacheKey = `forms:user:${userId}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
      const forms = await Form.findAll({
        where: { userId },
        include: withQuestions ? [{
          model: Question,
          as: 'questions',
          include: [{
            model: QuestionOption,
            as: 'options',
            include: [{
              model: QuestionOptionImage,
              as: 'images',
            }]
          }]
        }] : [],
        raw: false
      });
      const plainForms = forms.map(f => f.get({ plain: true }));
      return plainForms.map(removeSnakeCaseDuplicates);

    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }
}

module.exports = new FormService();
