const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils } = require('sharedjs');
module.exports.handler = async (event, _context) => {
    try {
        if (!utils.isEmpty(event.pathParameters)) {
            if (!utils.validateUserIdWithToken(event, event.pathParameters.id)) {
                return response.badRequest('Al parecer la solicitud no es permitida. Intenta nuevamente, por favor.');;
            }
            const validationResult = validator.validate(event.pathParameters);
            if (validationResult.error) {
                return response.badRequest(validationResult.error.details[0].message);
            }
            const result = await service.processData(event.pathParameters.id);
            result.username = utils.revertSanitizedKey(result.username);
            result.password = utils.revertSanitizedKey(result.password);
            delete result.password;
            return response.success(result);
        } else {
            return response.badRequest("¡Ups! No hay datos de entrada")
        }
    } catch (error) {
        console.error('Error in handler:', error);
        return response.buildError(error);
    }
};
