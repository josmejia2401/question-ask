const formService = require('../services/form.service');
const formValidator = require('../validations/form-validation');
const { internalServerError, success, badRequest, created } = require('../utils/response');
const getRequestLogger = require('../utils/request-logger');

function handleError(res, err) {
  if (err.name === 'CustomError') {
    return res.status(err.code).json(err.toJSON());
  } else {
    return res.status(500).json(internalServerError());
  }
}

exports.getAllForms = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const userId = req.user.keyid;
    const forms = await formService.findAll(userId, true);
    res.status(200).json(success(forms));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.getFormById = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const userId = req.user.keyid;
    const form = await formService.findById(req.params.id, userId);
    res.status(200).json(success(form));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.createForm = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error, value } = formValidator.validateForm(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const userId = req.user.keyid;
    const newForm = await formService.create({ ...value, userId });
    res.status(201).json(created(newForm));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.updateForm = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const { error, value } = formValidator.validateForm(req.body);
    if (error) {
      logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const userId = req.user.keyid;
    const updatedForm = await formService.update(req.params.id, { ...value, userId }, userId);
    res.status(200).json(success(updatedForm));
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};

exports.deleteForm = async (req, res) => {
  const logger = getRequestLogger(req.requestId);
  try {
    const userId = req.user.keyid;
    await formService.delete(req.params.id, userId);
    res.status(204).json(success());
  } catch (err) {
    logger.error(err);
    handleError(res, err);
  }
};
