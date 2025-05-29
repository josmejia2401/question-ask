const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        if (!utils.isEmpty(event.pathParameters)) {
            const authorization = utils.getAuthorization(event);
            const tokenDecoded = jwt.decodeToken(authorization);
            const userId = Number(tokenDecoded?.keyid);
            const body = {
                id: event.pathParameters.id,
                userId: userId
            };
            const validationResult = validator.validate(body);
            if (validationResult.error) {
                return response.badRequest(validationResult.error.details[0].message);
            }
            const result = await service.processData({
                id: event.pathParameters.id,
                userId: userId,
            });
            return response.success(result);
        } else {
            return response.badRequest("¡Ups! No hay datos de entrada")
        }
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
