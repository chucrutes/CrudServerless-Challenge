const fieldsToUpdate = (body) => {
    var fields = ['name', 'description', 'showDate']
    var fieldsToUpdate = []
    var expressions = []
    const bodyFields = Object.keys(body)

    for (let index = 0; index < bodyFields.length; index++) {
        if (fields.includes(bodyFields[index])) {
            fieldsToUpdate.push(bodyFields[index])
        }
    }

    const generateUpdateExpression = () => {
        var updateExpressionString = 'set'

        for (let index = 0; index < fieldsToUpdate.length; index++) {
            if (index == fieldsToUpdate.length - 1) {
                updateExpressionString = updateExpressionString.concat(' #old' + fieldsToUpdate[index].toUpperCase() + ' = :new' + fieldsToUpdate[index].toUpperCase())
            } else {
                updateExpressionString = updateExpressionString.concat(' #old' + fieldsToUpdate[index].toUpperCase() + ' = :new' + fieldsToUpdate[index].toUpperCase() + ',')
            }
        }
        return updateExpressionString
    }
    expressions.push(generateUpdateExpression())

    const generateExpressionAttributeNames = () => {
        var expressionAttributeNames = {}

        for (let index = 0; index < fieldsToUpdate.length; index++) {
            expressionAttributeNames['#old' + fieldsToUpdate[index].toUpperCase()] = fieldsToUpdate[index]
        }
        return expressionAttributeNames
    }

    expressions.push(generateExpressionAttributeNames())
    const generateExpressionAttributeValues = () => {
        var expressionAttributeValues = {}

        for (let index = 0; index < fieldsToUpdate.length; index++) {
            expressionAttributeValues[':new' + fieldsToUpdate[index].toUpperCase()] = body[fieldsToUpdate[index]]

        }
        return expressionAttributeValues
    }
    expressions.push(generateExpressionAttributeValues())

    return expressions

}
module.exports = fieldsToUpdate