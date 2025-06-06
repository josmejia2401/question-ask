const { v4: uuidv4 } = require('uuid');
const { Token } = require('../models/token.model');
const JWT = require('../helpers/utils/jwt');
const { forbidden, unAuthorized } = require('../helpers/utils/response');

async function ensureAuthenticated(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json(unAuthorized("Token is not defined"));
  }
  const token = auth.split(' ')[1];
  try {
    const decoded = JWT.validateToken(token);
    req.user = decoded;
    const exists = await Token.findByPk(decoded.jti);
    if (!exists) {
      return res.status(401).json(unAuthorized("¡Ups! Token is not defined"));
    }
    next();
  } catch (err) {
    return res.status(403).json(forbidden("Error al validar el token de sesión"));
  }
}

module.exports = { ensureAuthenticated };
