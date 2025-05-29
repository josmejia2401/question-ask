const { constants, errors } = require('sharedjs');
const { deleteItem } = require('dynamodbjs');

module.exports.processData = async (id) => {
  try {
    await deleteItem({
      Key: {
        "id": {
          N: `${id}`
        }
      },
      TableName: constants.TABLES.token
    });
    return {
      message: 'OK'
    }
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
