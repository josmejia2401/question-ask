const Joi = require('joi');

const imageSchema = Joi.object({
  imagePath: Joi.string().optional().messages({
    'any.required': `"imagePath" es requerido`
  }),
});

const optionSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.base': `"text" debe ser un texto`,
    'any.required': `"text" es requerido`
  }),
  images: Joi.array().items(imageSchema).optional().messages({
    'array.base': `"images" debe ser un arreglo`
  }),
});

const questionSchema = Joi.object({
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
});

const formSchema = Joi.object({
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
});


module.exports = {
  validateForm: (data) => formSchema.validate(data, { abortEarly: false }),
};
