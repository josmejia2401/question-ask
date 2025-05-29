class CustomError extends Error {
    constructor(message, code, error) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.error = error;
        Error.captureStackTrace(this, this.constructor);
    }

    toString() {
        return JSON.stringify({
            name: this.name,
            message: this.message,
            code: this.code,
            error: {
                name: this.error?.name,
                message: this.error?.message,
                stack: this.error?.stack
            }
        });
    }
}

module.exports.CustomError = CustomError;