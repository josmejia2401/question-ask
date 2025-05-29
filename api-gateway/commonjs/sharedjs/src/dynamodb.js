
module.exports.parseItemToDynamoDBFormat = function (value) {
    if (value === null) {
        return { NULL: true };
    }

    const type = typeof value;

    switch (type) {
        case 'number':
            return { N: value.toString() };

        case 'string':
            return { S: value };

        case 'boolean':
            return { BOOL: value };

        case 'object':
            if (Array.isArray(value)) {
                return {
                    L: value.map(item => this.parseItemToDynamoDBFormat(item))
                };
            } else {
                const mapped = {};
                for (const key of Object.keys(value)) {
                    mapped[key] = this.parseItemToDynamoDBFormat(value[key]);
                }
                return { M: mapped };
            }

        default:
            // Fallback: convertir a string si el tipo no es reconocido
            return { S: String(value) };
    }
};



module.exports.parseDynamoDBToItem = function (dynamoItem) {
    const parsedItem = {};
    for (const key in dynamoItem) {
        const valueObj = dynamoItem[key];
        if ('N' in valueObj) {
            parsedItem[key] = Number(valueObj.N); // Convertir a número
        } else if ('S' in valueObj) {
            parsedItem[key] = valueObj.S; // Asignar string
        } else if ('BOOL' in valueObj) {
            parsedItem[key] = valueObj.BOOL; // Asignar booleano
        } else if ('NULL' in valueObj) {
            parsedItem[key] = null; // Asignar null
        } else if ('L' in valueObj) {
            parsedItem[key] = valueObj.L.map(item => this.parseDynamoDBToItem({ temp: item }).temp); // Convertir lista recursivamente
        } else if ('M' in valueObj) {
            parsedItem[key] = this.parseDynamoDBToItem(valueObj.M); // Convertir objeto/mapa recursivamente
        }
    }
    return parsedItem;
}

module.exports.buildUpdateExpression = function (payload, ignoreKeys = []) {
    let updateExpression = 'SET';
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    // Obtener todas las claves del payload.
    const keys = Object.keys(payload);
    keys.forEach((key, index) => {
        if (!ignoreKeys.includes(key)) {
            // Se define un alias para el nombre y para el valor.
            const attrName = `#${key}`;
            const attrValue = `:${key}`;
            // Construir la UpdateExpression, separando los atributos con comas.
            updateExpression += ` ${attrName}=${attrValue}${index < keys.length - 1 ? ',' : ''}`;
            // Mapear el alias al nombre real del atributo.
            expressionAttributeNames[attrName] = key;
            // Convertir el valor al formato que DynamoDB espera.
            expressionAttributeValues[attrValue] = this.parseItemToDynamoDBFormat(payload[key]);
        }
    });
    if (updateExpression.charAt(updateExpression.length - 1) === ',') {
        updateExpression = updateExpression.substring(0, updateExpression.length - 1);
    }
    return {
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
}

module.exports.buildScanFilterExpression = function (filter, ignoreKeys = [], keysWithContains = []) {
    const conditions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    for (const key in filter) {
        if (!ignoreKeys.includes(key) && Object.prototype.hasOwnProperty.call(filter, key)) {
            const attrName = `#${key}`;
            const attrValue = `:${key}`;
            // Se construye la condición de igualdad para cada atributo.
            if (keysWithContains.includes(key)) {
                conditions.push(`contains(${attrName},${attrValue})`);
            } else {
                conditions.push(`${attrName}=${attrValue}`);
            }
            expressionAttributeNames[attrName] = key;
            expressionAttributeValues[attrValue] = this.parseItemToDynamoDBFormat(filter[key]);
        }
    }
    if (conditions.length === 0) {
        return {
            FilterExpression: undefined,
            ExpressionAttributeNames: undefined,
            ExpressionAttributeValues: undefined
        };
    }
    // Se unen las condiciones con "AND".
    const FilterExpression = conditions.join(' AND ');
    return {
        FilterExpression: FilterExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues
    };
}