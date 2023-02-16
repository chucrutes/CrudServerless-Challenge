const queryById = (tableName, id) => ({
    TableName: tableName,
    ExpressionAttributeValues: {
      ':id': id,
    },
    ExpressionAttributeNames: {
      '#id': 'id',
    },
    KeyConditionExpression: '#id = :id',
  });

module.exports = queryById