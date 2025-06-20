// ms-forms/src/controllers/authController.js
const authService = require('../services/auth.service');
const getRequestLogger = require('../helpers/utils/request-logger');
const { badRequest, success, buildError } = require('../helpers/utils/response');
const authValidator = require('../helpers/validations/auth-validator');

exports.login = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  const { error } = authValidator.validateLogin(req.body);
  if (error) {
    logger.error(badRequest(error.details[0].message));
    return res.status(400).json(badRequest(error.details[0].message));
  }
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json(success({ accessToken: token }));
  } catch (err) {
    logger.error(err);
    const errMsg = buildError(err);
    res.status(errMsg.code).json(errMsg);
  }
};

exports.logout = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const tokenId = req.user.jwtid;
    const userId = req.user.keyid;

    if (!tokenId || !userId) {
      return res.status(400).json(badRequest('Token o usuario inválido'));
    }

    await authService.logout(tokenId, userId);
    res.status(200).json(success({ message: 'Sesión cerrada correctamente' }));
  } catch (err) {
    logger.error(err);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error } = authValidator.validateRequestReset(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const { usernameOrEmail } = req.body;
    const result = await authService.requestPasswordReset(usernameOrEmail);
    res.status(200).json(success({ token: result }));
  } catch (err) {
    logger.error(err);
    const errMsg = buildError(err);
    res.status(errMsg.code).json(errMsg);
  }
};

// POST /auth/reset-password
exports.resetPassword = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error } = authValidator.validateResetPassword(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const { token, newPassword } = req.body;
    const result = await authService.resetPassword(token, newPassword);
    res.status(200).json(success(result));
  } catch (err) {
    logger.error(err);
    const errMsg = buildError(err);
    res.status(errMsg.code).json(errMsg);
  }
};

