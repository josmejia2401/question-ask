const Joi = require('joi');
module.exports.schema = Joi.object({
  password: Joi.string().min(6).required(),
  username: Joi.string().required(),
});
