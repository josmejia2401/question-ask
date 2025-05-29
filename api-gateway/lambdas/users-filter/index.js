const service = require('./src/service');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, _context) => {
    try {
        const authorization = utils.getAuthorization(event);
        const tokenDecoded = jwt.decodeToken(authorization);
        const userId = Number(tokenDecoded?.keyid);
        const role = tokenDecoded?.role;
        const queryStringParameters = event.queryStringParameters || {};
        const result = await service.processData(queryStringParameters, userId, role);
        result.items = result.items.map(p => {
            p.username = utils.revertSanitizedKey(p.username);
            p.password = utils.revertSanitizedKey(p.password);
            delete p.password;
            return p;
        });
        return response.success(result);
    } catch (error) {
        console.error('Error in handler', error);
        return response.buildError(error);
    }
};
