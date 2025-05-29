const { constants, errors, dynamodb, utils, logger } = require('sharedjs');
const { scan } = require('dynamodbjs');
module.exports.processData = async (queryStringParameters) => {
  try {
    let lastEvaluatedKey = undefined;
    if (queryStringParameters && queryStringParameters.id && queryStringParameters.userId) {
      lastEvaluatedKey = {
        id: {
          N: `${queryStringParameters.id}`
        },
        userId: {
          N: `${queryStringParameters.userId}`
        }
      }
    }
    const filterField = dynamodb.buildScanFilterExpression(queryStringParameters, ["id", "userId"], []);
    filterField.ExpressionAttributeValues = filterField.ExpressionAttributeValues;
    filterField.ExpressionAttributeNames = filterField.ExpressionAttributeNames;
    filterField.FilterExpression = filterField.FilterExpression;
    const params = {
      TableName: constants.TABLES.contents,
      ExpressionAttributeNames: filterField.ExpressionAttributeNames,
      ExpressionAttributeValues: filterField.ExpressionAttributeValues,
      FilterExpression: filterField.FilterExpression,
      projectionExpression: undefined,
      Limit: 10,
      LastEvaluatedKey: lastEvaluatedKey,
    };
    logger.info("RQ consulta a base de datos", params);
    return await scan(params);
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
