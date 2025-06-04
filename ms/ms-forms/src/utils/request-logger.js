// utils/request-logger.js
const baseLogger = require('./logger');
function getRequestLogger(requestId) {
    return {
        info: (msg) => baseLogger.info({ message: msg, requestId }),
        error: (msg) => baseLogger.error({ message: msg, requestId }),
        warn: (msg) => baseLogger.warn({ message: msg, requestId }),
        debug: (msg) => baseLogger.debug({ message: msg, requestId }),
    };
}
module.exports = getRequestLogger;
