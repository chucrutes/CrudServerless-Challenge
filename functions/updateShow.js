'use strict'
const AWS = require('aws-sdk');
const dateValidator = require('../dateValidator');
const expressionGenerator = require('../expressionGenerator');
const httpResponse = require('../httpResponse');
const verifyRequiredFields = require('../requiredFields');


module.exports.handle = async (event) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient()
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    const tableFields = ['name', 'description', 'showDate']
    
    try {
        
        dateValidator(body.showDate)
        verifyRequiredFields(body)

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
        await dynamoDB.update(putParams).promise();

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