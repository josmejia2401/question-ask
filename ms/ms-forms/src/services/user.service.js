const { CustomError } = require('../errors/errors');
const { User } = require('../models/user.model');
const bcrypt = require("bcrypt");
const { handleSequelizeError } = require('../utils/sequelize-error-handler');

class UserService {
    async createUser(data) {
        try {
            const existing = await User.findOne({ where: { username: data.username } });
            if (existing) {
                throw new CustomError('¡Ups! Al parecer el usuario ya existe.', 409);
            }
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
            const user = await User.create(data);
            return user;
        } catch (error) {
            if (error.name === "CustomError") {
                throw error;
            }
            throw handleSequelizeError(error);
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findByPk(id);
            if (isEmpty(form)) {
                throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
            }
            return user;
        } catch (error) {
            if (error.name === "CustomError") {
                throw error;
            }
            throw handleSequelizeError(error);
        }
    }

    async updateUser(id, data) {
        try {
            const user = await User.findByPk(id);
            if (isEmpty(form)) {
                throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
            }
            await user.update(data);
            return user;
        } catch (error) {
            if (error.name === "CustomError") {
                throw error;
            }
            throw handleSequelizeError(error);
        }
    }

    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (isEmpty(form)) {
                throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
            }
            await user.destroy();
            return;
        } catch (error) {
            if (error.name === "CustomError") {
                throw error;
            }
            throw handleSequelizeError(error);
        }
    }
}

module.exports = new UserService();
