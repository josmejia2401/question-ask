const { DataTypes } = require('sequelize');
const sequelize = require('../helpers/config/database');

const Response = sequelize.define("Response", {
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
    submittedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        field: "submitted_at",
    },
}, {
    tableName: "responses",
    timestamps: false,
    underscored: true,
    schema: 'questionask',
});

module.exports = { Response };