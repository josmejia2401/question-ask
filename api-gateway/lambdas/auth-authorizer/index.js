const { constants, logger, utils, jwt } = require('sharedjs');
const { getItem, deleteItem } = require('dynamodbjs');
exports.handler = async (event) => {
    const traceId = utils.getTraceID(event.headers || {});
    const response = {
        "isAuthorized": false,
        "context": {
            "traceID": traceId
        }
    };
    try {
        // TODO: Tener en cuenta la validación de token de proveedores externos (facebook, instagram, google)
        const authorization = utils.getAuthorization(event);
        if (authorization && jwt.isValidToken(authorization)) {
            const tokenDecoded = jwt.decodeToken(authorization);
            const responseToken = await getItem({
                Key: {
                    id: {
                        N: `${tokenDecoded.jti}`
                    }
                },
                ProjectionExpression: 'id, accessToken, userId, createdAt',
                TableName: constants.TABLES.token
            });
            if (responseToken &&
                Number(tokenDecoded.keyid) === Number(responseToken.userId) &&
                responseToken.accessToken === jwt._stripBearer(authorization)) {
                response.isAuthorized = true;
                logger.debug("Autorización existosa")
            } else if (responseToken && responseToken.id && responseToken.id) {
                await deleteItem({
                    Key: {
                        id: {
                            N: `${responseToken.id}`
                        }
                    },
                    TableName: constants.TABLES.token
                });
            }
        }
    } catch (err) {
        logger.error("Error intentando validar el token", err);
    }
    return response;
};