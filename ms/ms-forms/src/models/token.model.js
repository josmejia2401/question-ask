const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ajusta esta ruta según tu proyecto

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        field: 'user_id',
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'tokens',
    timestamps: false, // porque tienes created_at explícito
    underscored: true,
    schema: 'questionask', 
});

module.exports = { Token };
