const Joi = require('joi');
module.exports.schema = Joi.object({
  id: Joi.number().required(),
  userId: Joi.number().required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().allow('').max(500).optional(),
  type: Joi.string().valid("video", "image", "questions", "informative", "selections", "interactive", "icons", "stadium").required(),
  content: Joi.object().required(),
  statusId: Joi.string().valid("PENDIENTE", "ACTIVO", "INACTIVO").required(),
  createdAt: Joi.date().optional(),
});