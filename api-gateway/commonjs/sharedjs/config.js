// config.js
require('dotenv').config(); // Carga variables desde .env
module.exports = {
    ENVIRONMENT: process.env.ENVIRONMENT,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    AWS_REGION: process.env.AWS_REGION,
    APP_NAME: process.env.APP_NAME,
    JTW_SECRET_VALUE: process.env.JTW_SECRET_VALUE,
    JWT_TOKEN_LIFE: process.env.JWT_TOKEN_LIFE,
};
