const { constants, errors, utils } = require('sharedjs');
const { putItem } = require('dynamodbjs');

module.exports.processData = async (data) => {
  data.username = utils.sanitizeKey(data.username);
  data.password = utils.sanitizeKey(data.password);
  const params = {
    TableName: constants.TABLES.users,
    Item: data,
  };
  try {
    await putItem(params);
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
