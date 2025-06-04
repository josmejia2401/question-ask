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

const requestResetSchema = Joi.object({
  usernameOrEmail: Joi.string()
    .required()
    .messages({
      'string.base': 'El nombre de usuario o correo debe ser una cadena de texto.',
      'string.empty': 'El campo no puede estar vacío.',
      'any.required': 'El nombre de usuario o correo es obligatorio.',
    }),
});


const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'string.base': 'El token debe ser una cadena de texto.',
      'string.empty': 'El token no puede estar vacío.',
      'any.required': 'El token es obligatorio.',
    }),
  newPassword: Joi.string()
    .min(8)
    .max(64)
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      'string.base': 'La nueva contraseña debe ser una cadena de texto.',
      'string.empty': 'La nueva contraseña no puede estar vacía.',
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres.',
      'string.max': 'La nueva contraseña no debe superar los 64 caracteres.',
      'string.pattern.base': 'Debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
      'any.required': 'La nueva contraseña es obligatoria.',
    }),
});



module.exports = {
  validateLogin: (data) => loginSchema.validate(data, { abortEarly: false }),
  validateRequestReset: (data) => requestResetSchema.validate(data, { abortEarly: false }),
  validateResetPassword: (data) => resetPasswordSchema.validate(data, { abortEarly: false }),
};
