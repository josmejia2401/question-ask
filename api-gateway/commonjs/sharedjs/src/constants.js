const config = require("../config");
module.exports = {
    ENVIRONMENT: config.ENVIRONMENT,
    LOGGER_LEVEL: config.LOGGER_LEVEL,
    AWS_REGION: config.AWS_REGION,
    APP_NAME: config.APP_NAME,
    JWT: {
        SECRET_VALUE: config.JWT_SECRET_VALUE,
        TOKEN_LIFE: config.JWT_TOKEN_LIFE
    },
    TABLES: {
        users: `tbl-${config.APP_NAME}-users-${config.ENVIRONMENT}`,
        token: `tbl-${config.APP_NAME}-token-${config.ENVIRONMENT}`,
        contents: `tbl-${config.APP_NAME}-contents-${config.ENVIRONMENT}`,
    },
};
