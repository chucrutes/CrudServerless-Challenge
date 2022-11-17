var fields = ['name', 'description', 'showDate']
var fieldsToUpdate = []
var bodyFields = {name: "item updated"}
var b = Object.keys(bodyFields)
var expressions = []

for (let index = 0; index < b.length; index++) {
    if (fields.includes(b[index])) {
        fieldsToUpdate.push(b[index])
    }
}

const generateExpressionAttributeValues = () => {
    var expressionAttributeValues = {}

    for (let index = 0; index < fieldsToUpdate.length; index++) {
        console.log(fieldsToUpdate[index])
        expressionAttributeValues[':new' + fieldsToUpdate[index].toUpperCase()] = bodyFields[fieldsToUpdate[index]]

    }
    return expressionAttributeValues
}

expressions.push(generateExpressionAttributeValues())