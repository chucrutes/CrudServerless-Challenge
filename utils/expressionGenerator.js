function generateUpdateExpression(fields) {
    var updateExpressionString = 'set'

    for (let index = 0; index < fields.length; index++) {

        updateExpressionString = updateExpressionString.concat(' #old' + fields[index].toUpperCase() + ' = :new' + fields[index].toUpperCase() + ',')
    }

    updateExpressionString = updateExpressionString.substring(0, updateExpressionString.length - 1);
    return updateExpressionString
}

function generateExpressionAttributeNames(fields) {
    var expressionAttributeNames = {}

    for (let index = 0; index < fields.length; index++) {
        expressionAttributeNames['#old' + fields[index].toUpperCase()] = fields[index]
    }
    return expressionAttributeNames
}

function generateExpressionAttributeValues(fields, body) {
    var expressionAttributeValues = {}

    for (let index = 0; index < fields.length; index++) {
        expressionAttributeValues[':new' + fields[index].toUpperCase()] = body[fields[index]]

    }
    return expressionAttributeValues
}

function fieldsToUpdate(body, tableFields) {

    const bodyFields = Object.keys(body)

    const fieldsToBeUpdated = bodyFields.filter((field) => tableFields.includes(field))

    return fieldsToBeUpdated
}

function expressionGenerator(body, tableFields) {

    const fieldsToBeUpdated = fieldsToUpdate(body, tableFields)
    const updateExpression = generateUpdateExpression(fieldsToBeUpdated)
    const expressionAttributeNames = generateExpressionAttributeNames(fieldsToBeUpdated)
    const expressionAttributeValues = generateExpressionAttributeValues(fieldsToBeUpdated, body);

    return {
        updateExpression,
        expressionAttributeNames,
        expressionAttributeValues
    }



}
module.exports = expressionGenerator
