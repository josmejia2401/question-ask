const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');
const { Token } = require('../models/token.model');
const constants = require('../utils/constants');
const JWT = require('../utils/jwt');
const { buildUuid } = require('../utils/utils');
const { CustomError } = require('../errors/errors');

class AuthService {

    async login( username, password ) {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            throw new CustomError('Error al iniciar sesión; ID de usuario o contraseña son incorrectos', 401);
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            throw new CustomError('¡Ups! Error al iniciar sesión; ID de usuario o contraseña son incorrectos', 401);
        }
        const tokenId = buildUuid();
        const options = {
            algorithm: "HS256",
            audience: "questionask-webapp",
            subject: username,
            jwtid: tokenId,
            issuer: "ms-forms",
            expiresIn: constants.JWT_TOKEN_LIFE,
        };

        const token = JWT.sign({
            username: payload.username,
            keyid: payload.keyid, // ID del usuario
            role: payload.role,
            tokenId: tokenId
        }, constants.JTW_SECRET_VALUE, options);

        const decoded =  JWT.validateToken(token);
        const expTimestamp = decoded.exp;
        const expirationDate = new Date(expTimestamp * 1000);

        await Token.create({
            id: tokenId,
            userId: user.id,
            token: token,
            createdAt: Date.now(),
            expiresAt: expirationDate
        });

        return { token, user };
    }
}

module.exports = new AuthService();
