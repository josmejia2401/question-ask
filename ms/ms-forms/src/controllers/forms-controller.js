const formService = require('../services/form.service');
const formValidator = require('../validations/form-validation');
const { internalServerError, success, badRequest, created } = require('../utils/response');
const Logger = require('../utils/logger');

function handleError(res, err) {
  Logger.error(err);
  if (err.name === 'CustomError') {
    return res.status(err.code).json(err.toJSON());
  } else {
    return res.status(500).json(internalServerError());
  }
}

exports.getAllForms = async (req, res) => {
  try {
    const userId = req.user.keyid;
    const forms = await formService.getAllFormsByUserId(userId);
    res.status(200).json(success(forms));
  } catch (err) {
    handleError(res, err);
  }
};

exports.getFormById = async (req, res) => {
  try {
    const userId = req.user.keyid;
    const form = await formService.getFormById(req.params.id, userId);
    res.status(200).json(success(form));
  } catch (err) {
    handleError(res, err);
  }
};

exports.createForm = async (req, res) => {
  try {
    const { error, value } = formValidator.validateCreateForm(req.body);
    if (error) {
      Logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const userId = req.user.keyid;
    const newForm = await formService.createForm({ ...value, userId });
    res.status(201).json(created(newForm));
  } catch (err) {
    handleError(res, err);
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { error, value } = formValidator.validateUpdateForm(req.body);
    if (error) {
      Logger.error(badRequest(error.details[0].message));
      return res.status(400).json(badRequest(error.details[0].message));
    }
    const userId = req.user.keyid;
    const updatedForm = await formService.updateForm(req.params.id, value, userId);
    res.status(200).json(success(updatedForm));
  } catch (err) {
    handleError(res, err);
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const userId = req.user.keyid;
    await formService.deleteForm(req.params.id, userId);
    res.status(204).json(success());
  } catch (err) {
    handleError(res, err);
  }
};
