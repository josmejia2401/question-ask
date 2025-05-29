const {
    DynamoDBClient,
    PutItemCommand,
    GetItemCommand,
    ScanCommand,
    UpdateItemCommand,
    DeleteItemCommand,
    QueryCommand
} = require("@aws-sdk/client-dynamodb");
const { unmarshall, marshall } = require('@aws-sdk/util-dynamodb');
const { constants } = require('sharedjs');
const client = new DynamoDBClient({ apiVersion: "2012-08-10", region: constants.AWS_REGION });

const getItem = async (params) => {
    const command = new GetItemCommand(params);
    const response = await client.send(command);
    return response.Item ? unmarshall(response.Item) : null;
};

const putItem = async (params) => {
    const command = new PutItemCommand({
        ...params,
        Item: marshall(params.Item)
    });
    return await client.send(command);
};

const scan = async (params) => {
    const items = [];
    let lastEvaluatedKey = null;
    const limit = params.Limit || null;

    do {
        const currentParams = {
            ...params,
            ExclusiveStartKey: lastEvaluatedKey
        };

        const command = new ScanCommand(currentParams);
        const response = await client.send(command);

        const scannedItems = response.Items?.map(item => unmarshall(item)) || [];
        items.push(...scannedItems);

        lastEvaluatedKey = response.LastEvaluatedKey;

        // Si ya alcanzamos el límite deseado, salimos
        if (limit && items.length >= limit) {
            break;
        }

    } while (lastEvaluatedKey);

    // Si hay más elementos de los necesarios, hacer slice
    let finalItems = items;
    let finalLastEvaluatedKey = lastEvaluatedKey;

    if (limit && items.length > limit) {
        finalItems = items.slice(0, limit);

        // Calculamos la LastEvaluatedKey en base al último item del slice
        const lastItem = finalItems[finalItems.length - 1];

        // Usamos claves primarias dinámicamente si están definidas, o por defecto 'id'
        const keyAttributes = ['id', 'pk', 'sk']; // personaliza si usas otro esquema
        finalLastEvaluatedKey = {};

        keyAttributes.forEach(attr => {
            if (lastItem[attr]) {
                finalLastEvaluatedKey[attr] = lastItem[attr];
            }
        });
    }

    return {
        items: finalItems,
        lastEvaluatedKey: finalLastEvaluatedKey
    };
};


const scanCount = async (params) => {
    const command = new ScanCommand(params);
    const response = await client.send(command);
    return response.Count;
};

const deleteItem = async (params) => {
    const command = new DeleteItemCommand(params);
    return await client.send(command);
};

const updateItem = async (params) => {
    const command = new UpdateItemCommand(params);
    return await client.send(command);
};

const query = async (params) => {
    const items = [];
    let lastEvaluatedKey = null;
    const limit = params.Limit || null;

    do {
        const currentParams = {
            ...params,
            ExclusiveStartKey: lastEvaluatedKey
        };

        const command = new QueryCommand(currentParams);
        const response = await client.send(command);

        const queriedItems = response.Items?.map(item => unmarshall(item)) || [];
        items.push(...queriedItems);

        lastEvaluatedKey = response.LastEvaluatedKey;

        if (limit && items.length >= limit) {
            break;
        }

    } while (lastEvaluatedKey);

    // Slice si se excede el límite
    let finalItems = items;
    let finalLastEvaluatedKey = lastEvaluatedKey;

    if (limit && items.length > limit) {
        finalItems = items.slice(0, limit);

        // Estimar LastEvaluatedKey desde el último item del slice
        const lastItem = finalItems[finalItems.length - 1];

        const keyAttributes = ['id', 'pk', 'sk']; // Personaliza según tu clave compuesta
        finalLastEvaluatedKey = {};

        keyAttributes.forEach(attr => {
            if (lastItem[attr]) {
                finalLastEvaluatedKey[attr] = lastItem[attr];
            }
        });
    }

    return {
        items: finalItems,
        lastEvaluatedKey: finalLastEvaluatedKey
    };
};



module.exports.getItem = getItem;
module.exports.putItem = putItem;
module.exports.scan = scan;
module.exports.scanCount = scanCount;
module.exports.deleteItem = deleteItem;
module.exports.updateItem = updateItem;
module.exports.query = query;