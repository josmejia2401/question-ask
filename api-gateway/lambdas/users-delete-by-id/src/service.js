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
        TableName: constants.TABLES.users
      });
      return {
        id: data.id,
        statusId: "ELIMINADO"
      };
    }
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
