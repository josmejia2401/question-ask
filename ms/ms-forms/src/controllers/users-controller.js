const userService = require('../services/user.service');
const getRequestLogger = require('../helpers/utils/request-logger');
const { internalServerError, success, badRequest, forbidden, created } = require('../helpers/utils/response');
const userValidator = require('../helpers/validations/users-validation');

function handleError(res, err) {
  if (err.name === 'CustomError') {
    return res.status(err.code).json(err.toJSON());
  } else {
    return res.status(500).json(internalServerError());
  }
}

exports.createUser = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error, value } = userValidator.validateCreateUser(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const user = await userService.createUser(value);
    res.status(201).json(created(user));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.getUserById = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const userId = req.user.keyid;
    if (req.params.id !== userId) {
      logger.error(badRequest(forbidden()));
      return res.status(403).json(forbidden());
    }
    const user = await userService.getUserById(req.params.id);
    res.status(200).json(success(user));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.updateUser = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error, value } = userValidator.validateCreateUser(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const userId = req.user.keyid;
    if (req.params.id !== userId) {
      logger.error(badRequest(forbidden()));
      return res.status(403).json(forbidden());
    }
    const updatedUser = await userService.updateUser(req.params.id, value);
    res.status(200).json(success(updatedUser));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.deleteUser = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const userId = req.user.keyid;
    if (req.params.id !== userId) {
      logger.error(badRequest(forbidden()));
      return res.status(403).json(forbidden());
    }
    await userService.deleteUser(req.params.id);
    res.status(200).json(success());
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};
