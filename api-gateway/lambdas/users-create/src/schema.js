const Joi = require('joi');
module.exports.schema = Joi.object({
  id: Joi.number().required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).optional(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  username: Joi.string().required(),
  healthData: Joi.object({
    age: Joi.number().optional(),
    height: Joi.number().optional(),
  }).optional(),
  statusId: Joi.string().valid("PENDIENTE", "ACTIVO", "INACTIVO").required(),
  createdAt: Joi.date().required(),
});
