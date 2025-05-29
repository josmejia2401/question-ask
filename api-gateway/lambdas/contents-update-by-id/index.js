const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, _context) => {
    try {
        if (!utils.isEmpty(event.pathParameters)) {
            const authorization = utils.getAuthorization(event);
            const tokenDecoded = jwt.decodeToken(authorization);
            const userId = Number(tokenDecoded?.keyid);
            const body = JSON.parse(event.body);
            body.userId = userId;
            body.id = event.pathParameters.id;
            const validationResult = validator.validate(body);
            if (validationResult.error) {
                return response.badRequest(validationResult.error.details[0].message);
            }
            delete body.id;
            delete body.userId;
            const result = await service.processData(event.pathParameters.id, userId, body);
            return response.success(result);
        } else {
            return response.badRequest("¡Ups! No hay datos de entrada")
        }
    } catch (error) {
        console.error('Error in handler', error);
        return response.buildError(error);
    }
};
