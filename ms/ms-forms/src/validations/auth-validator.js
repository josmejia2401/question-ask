// ms-forms/src/validators/authValidator.js
const Joi = require('joi');

const loginSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'string.base': 'El nombre de usuario debe ser una cadena de texto.',
      'string.empty': 'El nombre de usuario no puede estar vacío.',
      'any.required': 'El nombre de usuario es obligatorio.',
    }),
  password: Joi.string()
    .required()
    .messages({
      'string.base': 'La contraseña debe ser una cadena de texto.',
      'string.empty': 'La contraseña no puede estar vacía.',
      'any.required': 'La contraseña es obligatoria.',
    }),
});

module.exports = {
  validateLogin: (data) => loginSchema.validate(data, { abortEarly: false }),
};
