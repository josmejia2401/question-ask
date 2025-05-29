const Joi = require('joi');
module.exports.schema = Joi.object({
  id: Joi.number().required(),
  firstName: Joi.string().max(50).required(),
  lastName: Joi.string().max(50).optional(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().optional(),
  password: Joi.string().min(6).optional(),
  username: Joi.string().optional(),
  healthData: Joi.object({
    age: Joi.number().optional(),
    height: Joi.number().optional(),
  }).optional(),
  statusId: Joi.string().optional(),
  createdAt: Joi.date().optional(),
});
