const service = require('./src/service');
const { response } = require('sharedjs');
module.exports.handler = async (event, _context) => {
    try {
        const queryStringParameters = event.queryStringParameters || {};
        const result = await service.processData(queryStringParameters);
        return response.success(result);
    } catch (error) {
        console.error('Error in handler', error);
        return response.buildError(error);
    }
};
