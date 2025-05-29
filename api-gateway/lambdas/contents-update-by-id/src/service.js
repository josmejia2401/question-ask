const { constants, dynamodb, errors } = require('sharedjs');
const { updateItem } = require('dynamodbjs');
module.exports.processData = async (id, userId, data) => {
  try {
    const item = dynamodb.buildUpdateExpression(data);
    console.log("item", id, userId, JSON.stringify(item));
    await updateItem({
      Key: {
        id: {
          N: `${id}`
        },
        userId: {
          N: `${userId}`
        }
      },
      ExpressionAttributeNames: item.ExpressionAttributeNames,
      ExpressionAttributeValues: item.ExpressionAttributeValues,
      UpdateExpression: item.UpdateExpression,
      ConditionExpression: undefined,
      FilterExpression: "attribute_exists(id)",
      TableName: constants.TABLES.contents
    });
    return {
      id,
      userId,
      ...data
    };
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
