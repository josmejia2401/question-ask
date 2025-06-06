const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/config/database'); // Ajusta esta ruta según tu proyecto

const Token = sequelize.define('Token', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        allowNull: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at',
        defaultValue: DataTypes.NOW,
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
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
