// ms-forms/src/controllers/authController.js
const authService = require('../services/auth.service');
const Logger = require('../utils/logger');
const { badRequest, success, buildError } = require('../utils/response');
const authValidator = require('../validations/auth-validator');

exports.login = async (req, res) => {
  const { error } = authValidator.validateLogin(req.body);
  if (error) {
    Logger.error(badRequest(error.details[0].message));
    return res.status(400).json(badRequest(error.details[0].message));
  }
  try {
    const { username, password } = req.body;
    const token = await authService.login(username, password);
    res.status(200).json(success({ accessToken: token }));
  } catch (err) {
    const errMsg = buildError(err);
    Logger.error(badRequest(errMsg));
    res.status(errMsg.code).json(errMsg);
  }
};
