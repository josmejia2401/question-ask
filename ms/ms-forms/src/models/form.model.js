const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/config/database');

const Form = sequelize.define('Form', {

    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "user_id",
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    isPublic: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_public",
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "created_at",
    },
}, {
    tableName: 'forms',
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { Form };
