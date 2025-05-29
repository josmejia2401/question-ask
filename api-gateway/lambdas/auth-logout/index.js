const service = require('./src/service');
const { response, utils, jwt } = require('sharedjs');
module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        const authorized = utils.getAuthorization(event);
        const userInfo = jwt.validateToken(authorized);
        console.log(userInfo);
        await service.processData(userInfo.jti);
        return response.success({
            message: 'Operación exitosa'
        });
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
