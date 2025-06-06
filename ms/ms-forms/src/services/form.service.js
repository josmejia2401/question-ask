const { CustomError } = require('../helpers/errors/errors');
const redis = require('../helpers/utils/redis-client');
const { handleSequelizeError } = require('../helpers/utils/sequelize-error-handler');
const { isEmpty } = require('../helpers/utils/utils');
const filesService = require('./files.service'); // ajusta ruta si es necesario

const { sequelize, Form, Question, QuestionOption, QuestionOptionImage } = require('../models');
const removeSnakeCaseDuplicates = require('../helpers/utils/camel-case');

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
      let form = cached ? JSON.parse(cached) : null;

      if (isEmpty(form)) {
        form = Form.findByPk(id, {
          include: [{
            model: Question,
            include: [{
              model: QuestionOption,
              include: [QuestionOptionImage]
            }]
          }]
        });
      }

      if (isEmpty(form)) {
        throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
      } else {
        redis.set(cacheKey, JSON.stringify(form), 'EX', 3600);
      }

      if (form.userId !== userId) {
        throw new CustomError('¡Ups! Elemento no permitido', 403);
      }

      return form;
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
        await QuestionOptionImage.destroy({
          where: { optionId: sequelize.literal(`IN (SELECT id FROM question_options WHERE question_id IN (SELECT id FROM questions WHERE form_id = '${id}'))`) },
          transaction: t
        });
        await QuestionOption.destroy({
          where: { questionId: sequelize.literal(`IN (SELECT id FROM questions WHERE form_id = '${id}')`) },
          transaction: t
        });
        await Question.destroy({ where: { formId: id }, transaction: t });

        // Insertar nuevas preguntas, opciones e imágenes (igual que en create)
        if (formData.questions && formData.questions.length > 0) {
          for (const q of formData.questions) {
            const question = await Question.create({
              formId: form.id,
              questionText: q.question_text,
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
                      imagePath: img.image_path,
                    }, { transaction: t });
                  }
                }
              }
            }
          }
        }
        return form;
      });

      redis.set(`forms:${form.id}`, JSON.stringify(form), 'EX', 3600);
      redis.del(`forms:user:${form.userId}`);

      return form;
    } catch (error) {
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
      /*const cacheKey = `forms:user:${userId}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }*/
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
