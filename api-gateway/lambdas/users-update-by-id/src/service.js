const { constants, dynamodb, errors, utils } = require('sharedjs');
const { updateItem } = require('dynamodbjs');
module.exports.processData = async (data) => {
  try {
    if (!utils.isEmpty(data.username)) {
      data.username = utils.sanitizeKey(data.username);
    }
    if (!utils.isEmpty(data.password)) {
      data.password = utils.sanitizeKey(data.password);
    }
    const item = dynamodb.buildUpdateExpression(data, ["id"]);
    await updateItem({
      Key: {
        id: {
          N: `${data.id}`
        },
      },
      ExpressionAttributeNames: item.ExpressionAttributeNames,
      ExpressionAttributeValues: item.ExpressionAttributeValues,
      UpdateExpression: item.UpdateExpression,
      ConditionExpression: undefined,
      FilterExpression: "attribute_exists(id)",
      TableName: constants.TABLES.users
    });
    data.username = utils.revertSanitizedKey(data.username);
    data.password = utils.revertSanitizedKey(data.password);
    return data;
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
