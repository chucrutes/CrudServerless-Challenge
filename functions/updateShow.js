'use strict'
const dateValidator = require('../utils/dateValidator');
const expressionGenerator = require('../utils/expressionGenerator');
const httpResponse = require('../utils/httpResponse');
const verifyRequiredFields = require('../utils/requiredFields');
const {update} = require('../utils/dynamodb')



module.exports.handle = async (event) => {
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    const tableFields = ['name', 'description', 'showDate']
    const requiredFields = ['name', 'showDate']
    
    try {
        
        dateValidator(body.showDate)
        verifyRequiredFields(body, requiredFields)

        const expression = expressionGenerator(body, tableFields)

        const putParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: id,
            },
            UpdateExpression: expression.updateExpression,
            ExpressionAttributeNames: expression.expressionAttributeNames,
            ExpressionAttributeValues: expression.expressionAttributeValues
        };
        await update(putParams)

        httpResponse.statusCode = 202
        httpResponse.body =  JSON.stringify({message: "Item updated successfully", putParams})

        return httpResponse

    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({error: error.message})
        }

    }
};