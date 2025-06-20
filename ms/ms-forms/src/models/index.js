const sequelize = require('../helpers/config/database');

const { Form } = require('./form.model');
const { Question } = require('./question.model');
const { QuestionOption } = require('./question_option.model');
const { QuestionOptionImage } = require('./question_option_image.model');
const { Response } = require('./response.model');
const { Answer } = require('./answer.model');
const { User } = require('./user.model'); // si tienes modelo User

// Asignar sequelize al modelo (si no lo hiciste en cada archivo, o puedes pasarlo como argumento)

Form.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Form, { foreignKey: 'user_id' });

Question.belongsTo(Form, { foreignKey: 'form_id', as: 'form', });
Form.hasMany(Question, { foreignKey: 'form_id', as: 'questions', onDelete: 'CASCADE' });

QuestionOption.belongsTo(Question, { foreignKey: 'question_id', as: 'question', });
Question.hasMany(QuestionOption, { foreignKey: 'question_id', onDelete: 'CASCADE', as: 'options', });

QuestionOptionImage.belongsTo(QuestionOption, { foreignKey: 'option_id', as: 'option', });
QuestionOption.hasMany(QuestionOptionImage, { foreignKey: 'option_id', onDelete: 'CASCADE', as: 'images', });

Response.belongsTo(Form, { foreignKey: 'form_id' });
Form.hasMany(Response, { foreignKey: 'form_id', onDelete: 'CASCADE' });

Answer.belongsTo(Response, { foreignKey: 'response_id' });
Response.hasMany(Answer, { foreignKey: 'response_id', onDelete: 'CASCADE' });

Answer.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = {
    sequelize,
    Form,
    Question,
    QuestionOption,
    QuestionOptionImage,
    Response,
    Answer,
    User,
};
