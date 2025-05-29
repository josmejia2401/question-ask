module.exports = class Logger {
    static _timestamp() {
        return new Date().toISOString();
    }

    static info(message, ...optionalParams) {
        console.info(`\x1b[36m[INFO] ${Logger._timestamp()} - ${message}`, ...optionalParams, '\x1b[0m');
    }

    static warn(message, ...optionalParams) {
        console.warn(`\x1b[33m[WARN] ${Logger._timestamp()} - ${message}`, ...optionalParams, '\x1b[0m');
    }

    static error(message, ...optionalParams) {
        console.error(`\x1b[31m[ERROR] ${Logger._timestamp()} - ${message}`, ...optionalParams, '\x1b[0m');
    }

    static debug(message, ...optionalParams) {
        if (process.env.DEBUG === 'true') {
            console.debug(`\x1b[35m[DEBUG] ${Logger._timestamp()} - ${message}`, ...optionalParams, '\x1b[0m');
        }
    }
}