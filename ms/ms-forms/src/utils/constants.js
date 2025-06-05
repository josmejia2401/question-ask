module.exports = {
    DATABASE_URL: process.env.DATABASE_URL,
    ENVIRONMENT: process.env.ENVIRONMENT,
    LOGGER_LEVEL: process.env.LOGGER_LEVEL,
    APP_NAME: process.env.APP_NAME,
    JTW_SECRET_VALUE: process.env.JTW_SECRET_VALUE,
    JWT_TOKEN_LIFE: process.env.JWT_TOKEN_LIFE,
    UPLOADS_DIR: process.env.UPLOADS_DIR,
    MAX_IMAGE_COUNT: process.env.UPLOADS_DIR || 3,
    MAX_IMAGE_SIZE_BYTES: (process.env.MAX_IMAGE_SIZE_BYTES || 5) * 1024 * 1024,
};
