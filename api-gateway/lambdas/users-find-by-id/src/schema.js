const Joi = require('joi');
module.exports.schema = Joi.object({
  id: Joi.number().required(),
});
