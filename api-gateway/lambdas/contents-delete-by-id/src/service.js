const { constants, utils, errors } = require('sharedjs');
const { deleteItem } = require('dynamodbjs');

module.exports.processData = async (data = { id: '', userId: '' }) => {
  try {
    if (!utils.isEmpty(data)) {
      await deleteItem({
        Key: {
          id: {
            N: `${data.id}`
          },
          userId: {
            N: `${data.userId}`
          }
        },
        TableName: constants.TABLES.contents
      });
      return {
        id: data.id,
        statusId: "DELETED"
      };
    }
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500);
    }
    throw error;
  }
};
