const { sign, decode, verify } = require("jsonwebtoken");
const constants = require("../constants");

module.exports = class JWT {
    /**
     * Decodifica un token JWT sin verificar su firma.
     */
    static decodeToken(token) {
        try {
            const rawToken = this._stripBearer(token);
            const decoded = decode(rawToken, { json: true });
            if (decoded?.username) delete decoded.username;
            return decoded;
        } catch (err) {
            console.error("Error decoding token:", err);
            return null;
        }
    }

    /**
     * Verifica si un token es válido.
     */
    static isValidToken(token) {
        try {
            const rawToken = this._stripBearer(token);
            this.validateToken(rawToken);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Decodifica la parte del payload sin verificación.
     */
    static parseJwt(token) {
        try {
            const rawToken = this._stripBearer(token);
            const payload = rawToken.split(".")[1];
            return JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        } catch (err) {
            console.error("Error parsing JWT:", err);
            return null;
        }
    }

    /**
     * Elimina el prefijo "Bearer ".
     */
    static _stripBearer(token) {
        return String(token).replace(/^Bearer\s+/i, "");
    }

    /**
     * Refresca un token existente, generando uno nuevo con la misma data.
     */
    static refreshToken(token) {
        try {
            const rawToken = this._stripBearer(token);
            const decoded = verify(rawToken, constants.JWT_SECRET_VALUE, {
                audience: constants.APP_NAME,
                algorithms: ["HS256"],
            });
            const payload = {
                username: decoded.username,
                password: decoded.password,
                id: decoded.keyid,
                tokenId: decoded.jti,
                name: decoded.iss,
            };
            return this.sign(payload);
        } catch (err) {
            console.error("Error refreshing token:", err);
            return null;
        }
    }

    /**
     * Firma un nuevo token JWT.
     */
    static sign(payload = { username: '', tokenId: '', keyid: '', role: 'user' }) {
        const options = {
            expiresIn: constants.JWT_TOKEN_LIFE,
            algorithm: "HS256",
            audience: constants.APP_NAME,
            subject: payload.username,
            jwtid: payload.tokenId, // ID del token
            issuer: "api-gateway",
        };
        const token = sign(
            {
                username: payload.username,
                keyid: payload.keyid, // ID del usuario
                role: payload.role
            },
            constants.JWT_SECRET_VALUE,
            options
        );
        return token;
    }

    /**
     * Valida un token usando la clave secreta y configuración esperada.
     */
    static validateToken(token) {
        const rawToken = this._stripBearer(token);
        return verify(rawToken, constants.JWT_SECRET_VALUE, {
            audience: constants.APP_NAME,
            algorithms: ["HS256"],
        });
    }
}
