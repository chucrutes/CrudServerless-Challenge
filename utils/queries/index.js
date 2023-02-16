const queryById = (tableName, id) => ({
  TableName: tableName,
  ExpressionAttributeValues: {
    ':primary_key': id,
  },
  ExpressionAttributeNames: {
    '#primary_key': 'primary_key',
  },
  KeyConditionExpression: '#primary_key = :primary_key',
});

const ticketsPerCpf = (tableName, cpf) => ({
  TableName: tableName,
  FilterExpression: "#cpf = :cpf",
  ExpressionAttributeNames: {
    "#cpf": 'cpf'
  },
  ExpressionAttributeValues: {
    ":cpf": cpf
  }
});

module.exports = { queryById, ticketsPerCpf }