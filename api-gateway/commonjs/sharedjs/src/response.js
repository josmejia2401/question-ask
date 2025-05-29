module.exports.success = (data) => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            code: 200,
            message: 'Operación exitosa',
            data: data
        }),
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };
};

module.exports.badRequest = (message) => {
    return {
        statusCode: 400,
        body: JSON.stringify({
            code: 400,
            message: message
        }),
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };
};

module.exports.internalServerError = (message) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            code: 500,
            message: message
        }),
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };
};

module.exports.unAuthorized = (message) => {
    return {
        statusCode: 401,
        body: JSON.stringify({
            code: 401,
            message: message
        }),
        headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    };
};

module.exports.buildError = (error) => {
    if (error.name === "CustomError") {
        switch (error.code) {
            case 500:
                return this.internalServerError(error.message);
            case 400:
                return this.badRequest(error.message);
            case 401:
                return this.unAuthorized(error.message);
            case 403:
                return this.unAuthorized(error.message);
            default:
                break;
        }
    }
    return this.internalServerError(error.message);
}