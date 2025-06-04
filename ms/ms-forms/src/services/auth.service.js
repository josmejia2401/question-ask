const bcrypt = require('bcrypt');
const crypto = require("crypto");
const { User } = require('../models/user.model');
const { Token } = require('../models/token.model');
const constants = require('../utils/constants');
const JWT = require('../utils/jwt');
const { CustomError } = require('../errors/errors');
const { Op } = require('sequelize');
const { PasswordReset } = require('../models/password-reset.model');

class AuthService {
    async login(username, password) {
        const user = await User.findOne({ where: { username } });
        if (!user) {
            throw new CustomError('Usuario o contraseña incorrectos', 401);
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new CustomError('Usuario o contraseña incorrectos', 401);
        }

        // Crear token en DB como referencia
        const tokenEntry = await Token.create({
            userId: user.id,
            token: '',
            createdAt: new Date(),
            expiresAt: null
        });

        const accessToken = JWT.sign({
            username: user.username,
            keyid: user.id,
            role: user.role ?? "user",
            tokenId: tokenEntry.id
        }, constants.JTW_SECRET_VALUE, {
            algorithm: 'HS256',
            audience: 'questionask-webapp',
            subject: user.username,
            jwtid: tokenEntry.id,
            issuer: 'ms-forms',
            expiresIn: constants.JWT_TOKEN_LIFE,
        });

        const decoded = JWT.validateToken(accessToken);
        const expDate = new Date(decoded.exp * 1000);

        await tokenEntry.update({
            token: accessToken,
            expiresAt: expDate
        });

        return accessToken;
    }

    async logout(tokenId, userId) {
        await Token.destroy({ where: { id: tokenId, userId } });
    }

    async refresh(refreshToken) {
        try {
            const payload = JWT.validateRefreshToken(refreshToken);
            const { tokenId, userId } = payload;

            const tokenEntry = await Token.findOne({ where: { id: tokenId, userId } });
            if (!tokenEntry) {
                throw new CustomError('Refresh token inválido o caducado', 403);
            }

            const user = await User.findByPk(userId);
            if (!user) {
                throw new CustomError('Usuario no encontrado', 404);
            }

            const newAccessToken = JWT.sign({
                username: user.username,
                keyid: user.id,
                role: user.role,
                tokenId: tokenEntry.id
            }, constants.JTW_SECRET_VALUE, {
                algorithm: 'HS256',
                audience: 'questionask-webapp',
                subject: user.username,
                jwtid: tokenEntry.id,
                issuer: 'ms-forms',
                expiresIn: constants.JWT_TOKEN_LIFE,
            });

            const decoded = JWT.validateToken(newAccessToken);
            const expDate = new Date(decoded.exp * 1000);
            await tokenEntry.update({ token: newAccessToken, expiresAt: expDate });

            return { accessToken: newAccessToken };
        } catch (error) {
            throw new CustomError('Token de actualización no válido', 403);
        }
    }



    async requestPasswordReset(usernameOrEmail) {
        const user = await User.findOne({
            where: {
                [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
            }
        });
        if (!user) throw new CustomError("Usuario no encontrado", 404);

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

        await PasswordReset.create({
            userId: user.id,
            token,
            expiresAt
        });

        // Aquí deberías enviar por correo (por ahora devolvemos el token)
        return token;
    }

    async resetPassword(token, newPassword) {
        const reset = await PasswordReset.findOne({
            where: {
                token,
                expiresAt: { [Op.gt]: new Date() }
            }
        });

        if (!reset) throw new CustomError("Token inválido o expirado", 400);

        const user = await User.findByPk(reset.userId);
        if (!user) throw new CustomError("Usuario no encontrado", 404);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        // Eliminar todos los tokens del usuario por seguridad
        await PasswordReset.destroy({ where: { userId: user.id } });

        return { message: "Contraseña actualizada correctamente" };
    }
}

module.exports = new AuthService();
