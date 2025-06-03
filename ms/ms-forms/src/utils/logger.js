module.exports = class Logger {
    static _timestamp() {
        return new Date().toISOString();
    }

    static _serialize(value) {
        if (value.name === "CustomError") {
            return value?.formatError();
        }
        if (value instanceof Error) {
            return value.stack;
        }

        try {
            return typeof value === 'object'
                ? JSON.stringify(value, null, 2)
                : String(value);
        } catch (err) {
            return '[Unserializable Object]';
        }
    }

    static _format(message, ...optionalParams) {
        const formattedMessage = Logger._serialize(message);
        const formattedParams = optionalParams.map(Logger._serialize);
        return [formattedMessage, ...formattedParams];
    }

    static info(message, ...optionalParams) {
        const [msg, ...params] = Logger._format(message, ...optionalParams);
        console.info(`\x1b[36m[INFO] ${Logger._timestamp()} - ${msg}\x1b[0m`, ...params);
    }

    static warn(message, ...optionalParams) {
        const [msg, ...params] = Logger._format(message, ...optionalParams);
        console.warn(`\x1b[33m[WARN] ${Logger._timestamp()} - ${msg}\x1b[0m`, ...params);
    }

    static error(message, ...optionalParams) {
        const [msg, ...params] = Logger._format(message, ...optionalParams);
        console.error(`\x1b[31m[ERROR] ${Logger._timestamp()} - ${msg}\x1b[0m`, ...params);
    }

    static debug(message, ...optionalParams) {
        if (process.env.DEBUG === 'true') {
            const [msg, ...params] = Logger._format(message, ...optionalParams);
            console.debug(`\x1b[35m[DEBUG] ${Logger._timestamp()} - ${msg}\x1b[0m`, ...params);
        }
    }
};
