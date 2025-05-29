const service = require('./src/service');
const validator = require('./src/validator');
const { response, utils } = require('sharedjs');
module.exports.handler = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
        // Parse the incoming body
        const body = JSON.parse(event.body);
        body.id = utils.buildUuid();
        body.createdAt = new Date().toISOString();
        body.statusId = "PENDIENTE";
        // Validate input data using Joi schema
        const validationResult = validator.validate(body);
        if (validationResult.error) {
            const message = validationResult.error.details[0].message.replace(/\"/g, "");
            return response.badRequest(message);
        }
        // Call the service to register the user in DynamoDB
        const result = await service.processData(body);
        // Respond with a success message
        return response.success({
            id: result.id
        });
    } catch (error) {
        console.error('Error in handler:', error);
        return response.buildError(error);
    }
};
