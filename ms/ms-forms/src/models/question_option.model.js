const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuestionOption = sequelize.define("QuestionOption", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "question_id",
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "question_options",
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { QuestionOption };


