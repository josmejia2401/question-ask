const service = require('./src/service');
const validator = require('./src/validator');
const { response } = require('sharedjs');
module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        // Parse the incoming body
        const body = JSON.parse(event.body);
        const validationResult = validator.validate(body);
        if (validationResult.error) {
            return response.badRequest(validationResult.error.details[0].message);
        }
        const result = await service.processData(body);
        return response.success(result);
    } catch (error) {
        console.error('Error in handler:', error);
        if (error.name === "CustomError") {
            switch (error.code) {
                case 500:
                    return response.internalServerError(error.message);
                case 400:
                    return response.badRequest(error.message);
                case 401:
                    return response.unAuthorized(error.message);
                case 403:
                    return response.unAuthorized(error.message);
                default:
                    break;
            }
        }
        return response.internalServerError(error.message);
    }
};
