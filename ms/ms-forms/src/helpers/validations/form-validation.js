const Joi = require('joi');

const imageSchema = Joi.object({
  id: Joi.string().optional().messages({
    'any.required': `"ID" es requerido`
  }),
  optionId: Joi.string().optional().messages({
    'any.required': `"optionId" es requerido`
  }),
  imagePath: Joi.string().required().messages({
    'any.required': `"imagePath" es requerido`
  }),
  createdAt: Joi.date().allow(null, '')
});

const optionSchema = Joi.object({
  id: Joi.string().optional().messages({
    'any.required': `"ID" es requerido`
  }),
  questionId: Joi.string().optional().messages({
    'any.required': `"questionId" es requerido`
  }),
  text: Joi.string().required().messages({
    'string.base': `"text" debe ser un texto`,
    'any.required': `"text" es requerido`
  }),
  images: Joi.array().items(imageSchema).optional().messages({
    'array.base': `"images" debe ser un arreglo`
  }),
  createdAt: Joi.date().allow(null, '')
});

const questionSchema = Joi.object({
  id: Joi.string().optional().messages({
    'any.required': `"ID" es requerido`
  }),
  formId: Joi.string().optional().messages({
    'any.required': `"optionId" es requerido`
  }),
  questionText: Joi.string().required().messages({
    'string.base': `"questionText" debe ser un texto`,
    'any.required': `"questionText" es requerido`
  }),
  type: Joi.string()
    .valid('short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'Hora', 'radio')
    .required()
    .messages({
      'any.only': `"type" debe ser uno de: short, long, multiple, checkbox, rating, date, Hora, radio`,
      'any.required': `"type" es requerido`
    }),
  required: Joi.boolean().default(false),
  order: Joi.number().integer().required().messages({
    'number.base': `"order" debe ser un número`,
    'any.required': `"order" es requerido`
  }),
  options: Joi.array().items(optionSchema).optional().messages({
    'array.base': `"options" debe ser un arreglo`
  }),
  createdAt: Joi.date().allow(null, '')
});

const formSchema = Joi.object({
  id: Joi.string().optional().messages({
    'any.required': `"ID" es requerido`
  }),
  userId: Joi.string().optional().messages({
    'any.required': `"optionId" es requerido`
  }),
  title: Joi.string().required().messages({
    'string.base': `"title" debe ser un texto`,
    'any.required': `"title" es requerido`
  }),
  description: Joi.string().allow(null, '').optional(),
  isPublic: Joi.boolean().default(false),
  questions: Joi.array().items(questionSchema).required().messages({
    'array.base': `"questions" debe ser un arreglo`,
    'any.required': `"questions" es requerido`
  }),
  createdAt: Joi.date().allow(null, '')
});


module.exports = {
  validateForm: (data) => formSchema.validate(data, { abortEarly: false }),
};
