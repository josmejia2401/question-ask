const Joi = require('joi');

const createUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'any.required': 'El nombre es obligatorio.',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'El apellido debe ser un texto.',
    'string.empty': 'El apellido no puede estar vacío.',
    'any.required': 'El apellido es obligatorio.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico debe tener un formato válido.',
    'string.empty': 'El correo electrónico no puede estar vacío.',
    'any.required': 'El correo electrónico es obligatorio.',
  }),
  phoneNumber: Joi.string().required().messages({
    'string.base': 'El número de teléfono debe ser un texto.',
    'string.empty': 'El número de teléfono no puede estar vacío.',
    'any.required': 'El número de teléfono es obligatorio.',
  }),
  username: Joi.string().required().messages({
    'string.base': 'El nombre de usuario debe ser un texto.',
    'string.empty': 'El nombre de usuario no puede estar vacío.',
    'any.required': 'El nombre de usuario es obligatorio.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres.',
    'string.empty': 'La contraseña no puede estar vacía.',
    'any.required': 'La contraseña es obligatoria.',
  }),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().required().messages({
    'string.base': 'El nombre debe ser un texto.',
    'string.empty': 'El nombre no puede estar vacío.',
    'any.required': 'El nombre es obligatorio.',
  }),
  lastName: Joi.string().required().messages({
    'string.base': 'El apellido debe ser un texto.',
    'string.empty': 'El apellido no puede estar vacío.',
    'any.required': 'El apellido es obligatorio.',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'El correo electrónico debe tener un formato válido.',
    'string.empty': 'El correo electrónico no puede estar vacío.',
    'any.required': 'El correo electrónico es obligatorio.',
  }),
  phoneNumber: Joi.string().required().messages({
    'string.base': 'El número de teléfono debe ser un texto.',
    'string.empty': 'El número de teléfono no puede estar vacío.',
    'any.required': 'El número de teléfono es obligatorio.',
  }),
  username: Joi.string().required().messages({
    'string.base': 'El nombre de usuario debe ser un texto.',
    'string.empty': 'El nombre de usuario no puede estar vacío.',
    'any.required': 'El nombre de usuario es obligatorio.',
  }),
});

module.exports = {
  validateCreateUser: (data) => createUserSchema.validate(data, { abortEarly: false }),
  validateUpdateUser: (data) => updateUserSchema.validate(data, { abortEarly: false }),
};
