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
}

module.exports.CustomError = CustomError;
