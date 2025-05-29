const { constants, errors } = require('sharedjs');
const { putItem } = require('dynamodbjs');

module.exports.processData = async (data) => {
  const params = {
    TableName: constants.TABLES.contents,
    Item: data,
  };
  try {
    await putItem(params);
    return data;
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
