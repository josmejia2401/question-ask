// utils/logger.js
const { createLogger, format, transports } = require('winston');
const { CustomError } = require('../errors/errors');

const customFormat = format.printf(({ timestamp, level, message, requestId }) => {
    let logMessage = `[${timestamp}] [${level.toUpperCase()}]${requestId ? ` [reqId: ${requestId}]` : ''} `;
    if (message instanceof CustomError) {
        logMessage += `${message.name}: ${message.message}`;
        logMessage += `\n${message.error || message.stack}`;
    } else if (message instanceof Error) {
        logMessage += `${message.name}: ${message.message}`;
        logMessage += `\n${message.stack}`;
    } else {
        logMessage += JSON.stringify(message);
    }
    return logMessage;
});

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), customFormat),
    transports: [new transports.Console()],
});

module.exports = logger;
