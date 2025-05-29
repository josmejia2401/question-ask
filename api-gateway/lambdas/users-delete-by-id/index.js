const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        if (!utils.isEmpty(event.pathParameters)) {
            if (!utils.validateUserIdWithToken(event, event.pathParameters.id)) {
                return response.badRequest('Al parecer la solicitud no es permitida. Intenta nuevamente, por favor.');;
            }
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
        console.error('Error in handler', error);
        return response.buildError(error);
    }
};
