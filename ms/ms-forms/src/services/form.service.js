const { CustomError } = require('../errors/errors');
const { Form } = require('../models/form.model');
const redis = require('../utils/redis-client');
const { handleSequelizeError } = require('../utils/sequelize-error-handler');
const { isEmpty } = require('../utils/utils');
const filesService = require('./files.service'); // ajusta ruta si es necesario


class FormService {
  async createForm(data) {
    try {
      const form = await Form.create(data);

      // Cachear el nuevo formulario y la lista del usuario
      redis.set(`forms:${form.id}`, JSON.stringify(form), 'EX', 1800);
      redis.del(`forms:user:${form.userId}`); // Invalida la lista por usuario

      return form;
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  async getAllFormsByUserId(userId) {
    try {
      const cacheKey = `forms:user:${userId}`;
      const cached = await redis.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const forms = await Form.findAll({ where: { userId } });
      redis.set(cacheKey, JSON.stringify(forms), 'EX', 1800); // 30 min
      return forms;
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  async getFormById(id, userId) {
    try {
      const cacheKey = `forms:${id}`;
      const cached = await redis.get(cacheKey);
      let form = cached ? JSON.parse(cached) : null;

      if (!form) {
        form = await Form.findByPk(id);
        if (form) redis.set(cacheKey, JSON.stringify(form), 'EX', 3600);
      }

      if (isEmpty(form)) {
        throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
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

  async updateForm(id, data, userId) {
    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
      if (userId && form.userId !== userId) throw new CustomError('¡Ups! Elemento no permitido', 403);

      await form.update(data);

      // Actualizar caché
      redis.set(`forms:${form.id}`, JSON.stringify(form), 'EX', 3600);
      redis.del(`forms:user:${form.userId}`); // Invalida lista por usuario

      return form;
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }

  async deleteForm(id, userId) {
    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) throw new CustomError(`Elemento con ID ${id} no encontrado`, 404);
      if (userId && form.userId !== userId) throw new CustomError('¡Ups! Elemento no permitido', 403);

      // 2. Elimina los archivos asociados
      filesService.deleteFormFiles(userId, form.id);

      await form.destroy();

      // Invalidar caché
      redis.del(`forms:${id}`);
      redis.del(`forms:user:${form.userId}`);

      return { message: `Formulario con ID ${id} eliminado correctamente` };
    } catch (error) {
      if (error.name === "CustomError") throw error;
      throw handleSequelizeError(error);
    }
  }
}

module.exports = new FormService();
