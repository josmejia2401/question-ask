const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuestionOptionImage = sequelize.define("QuestionOptionImage", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    optionId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "option_id",
    },
    imagePath: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "image_path",
    },
}, {
    tableName: "question_option_images",
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { QuestionOptionImage };
