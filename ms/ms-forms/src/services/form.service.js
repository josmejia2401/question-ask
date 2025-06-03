const { CustomError } = require('../errors/errors');
const { Form } = require('../models/form.model');
const { handleSequelizeError } = require('../utils/sequelize-error-handler');
const { isEmpty } = require('../utils/utils');

class FormService {
  async createForm(data) {
    try {
      const form = await Form.create(data);
      return form;
    } catch (error) {
      if (error.name === "CustomError") {
        throw error;
      }
      throw handleSequelizeError(error);
    }
  }

  async getAllFormsByUserId(userId) {
    try {
      const forms = await Form.findAll({ where: { userId } });
      return forms;
    } catch (error) {
      if (error.name === "CustomError") {
        throw error;
      }
      throw handleSequelizeError(error);
    }
  }

  async getFormById(id, userId) {
    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) {
        throw CustomError(`Elemento con ID ${id} no encontrado`, 404);
      }
      if (form.userId !== userId) {
        throw CustomError('¡Ups! Elemento no permitido', 403);
      }
      return form;
    } catch (error) {
      if (error.name === "CustomError") {
        throw error;
      }
      throw handleSequelizeError(error);
    }
  }

  async updateForm(id, data, userId) {
    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) {
        throw CustomError(`Elemento con ID ${id} no encontrado`, 404);
      }
      if (userId && form.userId !== userId) {
        throw CustomError('¡Ups! Elemento no permitido', 403);
      }
      await form.update(data);
      return form;
    } catch (error) {
      if (error.name === "CustomError") {
        throw error;
      }
      throw handleSequelizeError(error);
    }
  }

  async deleteForm(id, userId) {
    try {
      const form = await Form.findByPk(id);
      if (isEmpty(form)) {
        throw CustomError(`Elemento con ID ${id} no encontrado`, 404);
      }
      if (userId && form.userId !== userId) {
        throw CustomError('¡Ups! Elemento no permitido', 403);
      }
      await form.destroy();
      return { message: `Form with ID ${id} deleted successfully` };
    } catch (error) {
      if (error.name === "CustomError") {
        throw error;
      }
      throw handleSequelizeError(error);
    }
  }
}

module.exports = new FormService();
