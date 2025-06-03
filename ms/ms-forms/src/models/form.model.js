const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta esta ruta según tu proyecto

const Form = sequelize.define('Form', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
    },
    questionText: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'question_text',
    },
    answer: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'time']],
        },
    },
    options: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    required: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'forms',
    timestamps: false, // desactivo timestamps porque tienes created_at explícito
    underscored: true,
    schema: 'questionask', 
});

module.exports = { Form };
