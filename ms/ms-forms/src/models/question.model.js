const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Question = sequelize.define("Question", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    formId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "form_id",
    },
    questionText: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "question_text",
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'time']],
        }
    },
    required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    order: {
        type: DataTypes.INTEGER,
        field: "order",
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    tableName: "questions",
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { Question };
