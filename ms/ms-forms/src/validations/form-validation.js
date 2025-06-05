const Joi = require('joi');

const createFormSchema = Joi.object({
  questionText: Joi.string().min(3).max(255).required()
    .messages({
      'string.base': 'La pregunta debe ser un texto.',
      'string.empty': 'La pregunta no puede estar vacía.',
      'string.min': 'La pregunta debe tener al menos {#limit} caracteres.',
      'string.max': 'La pregunta no puede exceder los {#limit} caracteres.',
      'any.required': 'La pregunta es obligatoria.',
    }),
  answer: Joi.string().allow(null, '')
    .messages({
      'string.base': 'La respuesta debe ser un texto.',
    }),
  type: Joi.string().valid('short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'time').required()
    .messages({
      'any.only': 'El tipo debe ser uno de: text, textarea, select, checkbox, radio.',
      'any.required': 'El tipo de campo es obligatorio.',
      'string.base': 'El tipo debe ser un texto.',
    }),
  options: Joi.array().items(Joi.object()).optional()
    .messages({
      'array.base': 'Las opciones deben ser una lista de textos.',
    }),
  required: Joi.boolean().default(false)
    .messages({
      'boolean.base': 'El campo "required" debe ser verdadero o falso.',
    }),
  userId: Joi.string().required()
    .messages({
      'string.guid': 'El ID de usuario debe ser un UUID válido.',
      'any.required': 'El ID de usuario es obligatorio.',
    }),
  isPublic: Joi.boolean().default(false)
    .messages({
      'boolean.base': 'El campo "Es Público" debe ser verdadero o falso.',
    }),
});

const updateFormSchema = Joi.object({
  id: Joi.string().required()
    .messages({
      'string.guid': 'El ID de usuario debe ser un UUID válido.',
    }),
  questionText: Joi.string().min(3).max(255)
    .messages({
      'string.base': 'La pregunta debe ser un texto.',
      'string.min': 'La pregunta debe tener al menos {#limit} caracteres.',
      'string.max': 'La pregunta no puede exceder los {#limit} caracteres.',
    }),
  answer: Joi.string().allow(null, '')
    .messages({
      'string.base': 'La respuesta debe ser un texto.',
    }),
  type: Joi.string().valid('short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'time')
    .messages({
      'any.only': 'El tipo debe ser uno de: text, textarea, select, checkbox, radio.',
      'string.base': 'El tipo debe ser un texto.',
    }),
  options: Joi.array().items(Joi.object())
    .messages({
      'array.base': 'Las opciones deben ser una lista de textos.',
    }),
  required: Joi.boolean()
    .messages({
      'boolean.base': 'El campo "required" debe ser verdadero o falso.',
    }),
  isPublic: Joi.boolean().default(false)
    .messages({
      'boolean.base': 'El campo "Es Público" debe ser verdadero o falso.',
    }),
  userId: Joi.string().required()
    .messages({
      'string.guid': 'El ID de usuario debe ser un UUID válido.',
    }),
  createdAt: Joi.date().required()
    .messages({
      'string.guid': 'La fecha de creación es requerida.',
    }),
});

module.exports = {
  validateCreateForm: (data) => createFormSchema.validate(data, { abortEarly: false }),
  validateUpdateForm: (data) => updateFormSchema.validate(data, { abortEarly: false }),
};
