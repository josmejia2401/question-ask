const { constants, utils, jwt, errors } = require('sharedjs');
const { scan, deleteItem, putItem } = require('dynamodbjs');

module.exports.processData = async (payload) => {
  try {
    payload.username = utils.sanitizeKey(payload.username);
    payload.password = utils.sanitizeKey(payload.password);
    console.log("payload entrada", JSON.stringify({
      ExpressionAttributeValues: {
        ':username': {
          'S': `${payload.username}`
        },
        ':password': {
          'S': `${payload.password}`
        },
      },
      ExpressionAttributeNames: {
        '#username': 'username',
        '#password': 'password',
      },
      ProjectionExpression: 'id, firstName, lastName, email, username',
      FilterExpression: '#username=:username AND #password=:password',
      TableName: constants.TABLES.users
    }));
    const responseUsers = await scan({
      ExpressionAttributeValues: {
        ':username': {
          'S': `${payload.username}`
        },
        ':password': {
          'S': `${payload.password}`
        },
      },
      ExpressionAttributeNames: {
        '#username': 'username',
        '#password': 'password',
      },
      ProjectionExpression: 'id, firstName, lastName, email, username',
      FilterExpression: '#username=:username AND #password=:password',
      Limit: 1,
      TableName: constants.TABLES.users
    });

    if (responseUsers.items.length === 0) {
      throw new errors.CustomError('Error al iniciar sesión; ID de usuario o contraseña son incorrectos', 401);
    } else {
      const userId = responseUsers.items[0].id;
      const responseTokens = await scan({
        ExpressionAttributeValues: {
          ':userId': {
            N: `${userId}`
          }
        },
        ProjectionExpression: undefined,
        FilterExpression: 'userId=:userId',
        TableName: constants.TABLES.token
      });
      if (responseTokens.items.length > 0) {
        const promises = responseTokens.items.map(token => deleteItem({
          Key: {
            id: {
              N: `${token.id}`
            }
          },
          TableName: constants.TABLES.token
        }));
        await Promise.all(promises);
      }
      const tokenId = utils.buildUuid();
      // temporalmente el usuario username, es admin
      const role = "admin";//;(payload.username === 'username') ? 'admin' : 'user';
      const username = utils.revertSanitizedKey(responseUsers.items[0].username);
      const accessToken = jwt.sign({
        username: username,
        name: responseUsers.items[0].firstName,
        tokenId: `${tokenId}`,
        keyid: `${userId}`,
        role: role
      });
      await putItem({
        Item: {
          id: tokenId,
          userId: userId,
          accessToken: `${accessToken}`,
          createdAt: `${new Date().toISOString()}`,
        },
        TableName: constants.TABLES.token
      });
      return {
        accessToken: accessToken
      };
    }
  } catch (error) {
    if (error.name !== "CustomError") {
      throw new errors.CustomError('Error desconocido por el sistema', 500, error);
    }
    throw error;
  }
};
