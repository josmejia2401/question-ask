class CustomError extends Error {

    constructor(message, code = 500, error = null) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.error = error instanceof Error ? error.stack : error;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
        };
    }

    formatError() {
        if (this.error instanceof Error) {
            return {
                message: this.message,
                stack: this.error.stack,
            };
        } else if (typeof err === 'object') {
            try {
                return JSON.stringify(this.error, null, 2);
            } catch {
                return String(this.error);
            }
        }
        return this.error;
    }
}

module.exports.CustomError = CustomError;
