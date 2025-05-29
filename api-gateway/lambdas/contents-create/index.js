const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, _context) => {
    try {
        const authorization = utils.getAuthorization(event);
        const tokenDecoded = jwt.decodeToken(authorization);
        const userId = Number(tokenDecoded?.keyid);
        const body = JSON.parse(event.body);
        body.id = utils.buildUuid();
        body.userId = userId;
        body.createdAt = new Date().toISOString();
        const validationResult = validator.validate(body);
        if (validationResult.error) {
            const message = validationResult.error.details[0].message.replace(/\"/g, "");
            return response.badRequest(message);
        }
        const result = await service.processData(body);
        return response.success({
            id: result.id,
            createdAt: result.createdAt
        });
    } catch (error) {
        console.error('Error in handler', error);
        return response.buildError(error);
    }
};
