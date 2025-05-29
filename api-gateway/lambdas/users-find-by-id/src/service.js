const { constants, dynamodb, errors } = require('sharedjs');
const { getItem } = require('dynamodbjs');
module.exports.processData = async (id) => {
  const params = {
    TableName: constants.TABLES.users,
    Key: {
      "id": {
        N: `${id}`
      }
    }
  };
  try {
    return getItem(params);
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
