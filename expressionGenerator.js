
function generateUpdateExpression(fields){
    var updateExpressionString = 'set'

    for (let index = 0; index < fields.length; index++) {
        if (index == fields.length - 1) {
            updateExpressionString = updateExpressionString.concat(' #old' + fields[index].toUpperCase() + ' = :new' + fields[index].toUpperCase())
        } else {
            updateExpressionString = updateExpressionString.concat(' #old' + fields[index].toUpperCase() + ' = :new' + fields[index].toUpperCase() + ',')
        }
    }
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

function fieldsToUpdate(body) {
    var tableFields = ['name', 'description', 'showDate']
    var fieldsToBeUpdated = []
    const bodyFields = Object.keys(body)

    for (let index = 0; index < bodyFields.length; index++) {
        if (tableFields.includes(bodyFields[index])) {
            fieldsToBeUpdated.push(bodyFields[index])
        }
    }

    return fieldsToBeUpdated
}

function expressionGenerator(body){
    const fieldsToBeUpdated = fieldsToUpdate(body) 
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
