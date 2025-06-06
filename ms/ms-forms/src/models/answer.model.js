const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/config/database');

const Answer = sequelize.define("Answer", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    responseId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "response_id",
    },
    questionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "question_id",
    },
    answerText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: "answer_text",
    },
}, {
    tableName: "answers",
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { Answer };