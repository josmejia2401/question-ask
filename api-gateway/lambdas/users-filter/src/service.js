const { constants, errors, dynamodb, utils, logger } = require('sharedjs');
const { scan } = require('dynamodbjs');
module.exports.processData = async (queryStringParameters, userIdSession, role) => {
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
    if (!role || role !== "admin") {
      filterField.ExpressionAttributeValues = {
        ...filterField.ExpressionAttributeValues,
        ":userId": {
          N: `${userIdSession}`
        }
      };
      filterField.ExpressionAttributeNames = {
        ...filterField.ExpressionAttributeNames,
        "#userId": "userId"
      };
      filterField.FilterExpression = utils.isEmpty(filterField.FilterExpression) ?
        "#userId=:userId"
        :
        filterField.FilterExpression.concat(" AND ").concat("#userId=:userId");
    }

    const params = {
      TableName: constants.TABLES.users,
      ExpressionAttributeNames: filterField.ExpressionAttributeNames,
      ExpressionAttributeValues: filterField.ExpressionAttributeValues,
      FilterExpression: filterField.FilterExpression,
      projectionExpression: undefined,
      Limit: 10,
      LastEvaluatedKey: lastEvaluatedKey,
    };
    return await scan(params);
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
