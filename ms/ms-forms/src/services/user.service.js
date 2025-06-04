const { CustomError } = require('../errors/errors');
const { User } = require('../models/user.model');
const bcrypt = require("bcrypt");
const redis = require('../utils/redis-client');
const { handleSequelizeError } = require('../utils/sequelize-error-handler');
const { isEmpty } = require('../utils/utils');
const fs = require('fs');
const path = require('path');

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
            redis.set(`users:${user.id}`, JSON.stringify(user), 'EX', 3600);

            delete data.password;

            return user;
        } catch (error) {
            if (error.name === "CustomError") throw error;
            throw handleSequelizeError(error);
        }
    }

    async getUserById(id) {
        try {
            const cacheKey = `users:${id}`;
            const cached = await redis.get(cacheKey);
            let user = cached ? JSON.parse(cached) : null;

            if (!user) {
                user = await User.findByPk(id);
                if (isEmpty(user)) {
                    throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
                }
                redis.set(cacheKey, JSON.stringify(user), 'EX', 3600);
            }

            delete user.password;
            return user;
        } catch (error) {
            if (error.name === "CustomError") throw error;
            throw handleSequelizeError(error);
        }
    }

    async updateUser(id, data) {
        try {
            const user = await User.findByPk(id);
            if (isEmpty(user)) {
                throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
            }

            await user.update(data);

            // Refrescar caché
            redis.set(`users:${user.id}`, JSON.stringify(user), 'EX', 3600);

            delete user.password;

            return user;
        } catch (error) {
            if (error.name === "CustomError") throw error;
            throw handleSequelizeError(error);
        }
    }

    async deleteUser(id) {
        try {
            const user = await User.findByPk(id);
            if (isEmpty(user)) {
                throw CustomError(`¡Ups! Elemento con ID ${id} no encontrado`, 404);
            }

            // 1. Eliminar archivos asociados

            // Construir la ruta de los archivos del usuario
            const userUploadsPath = path.join(__dirname, '..', 'uploads', user.id.toString());

            // Función para eliminar un directorio de forma recursiva con fs.promises
            async function removeDirRecursively(dirPath) {
                if (!fs.existsSync(dirPath)) return;

                const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

                // Recorrer todas las entradas
                for (const entry of entries) {
                    const fullPath = path.join(dirPath, entry.name);

                    if (entry.isDirectory()) {
                        // Recursivamente eliminar subcarpetas
                        await removeDirRecursively(fullPath);
                    } else {
                        // Eliminar archivo
                        await fs.promises.unlink(fullPath);
                    }
                }
                // Eliminar el directorio vacío
                await fs.promises.rmdir(dirPath);
            }

            // Eliminar los archivos y carpeta del usuario
            await removeDirRecursively(userUploadsPath);
            await user.destroy();

            // Eliminar caché
            redis.del(`users:${id}`);
            return { message: `Usuario con ID ${id} eliminado correctamente` };
        } catch (error) {
            if (error.name === "CustomError") throw error;
            throw handleSequelizeError(error);
        }
    }
}

module.exports = new UserService();
