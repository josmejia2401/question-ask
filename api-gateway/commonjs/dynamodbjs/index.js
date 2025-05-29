const dynamodb = require("./src/dynamodb");
module.exports = {
    ...dynamodb
}

/*
getItem: dynamodb.getItem,
    putItem: dynamodb.putItem,
    scan: dynamodb.scan,
    scanCount: dynamodb.scanCount,
    deleteItem: dynamodb.deleteItem,
    updateItem: dynamodb.updateItem,
    query: dynamodb.query
     */