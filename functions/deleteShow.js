'use strict'
const AWS = require('aws-sdk');
const expressionGenerator = require('../expressionGenerator');


module.exports.handle = async (event) => {
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    const dynamoDB = new AWS.DynamoDB.DocumentClient()
    
    const requiredFields = ['name', 'showDate']
    const showDate = new Date(body.showDate)
    const currentDate = new Date()
    var expressions = expressionGenerator(body, showDate)

    try {

        if (showDate == 'Invalid Date' || showDate.getTime() < currentDate.getTime()) {
            throw new Error('Invalid Date')
        }

        for (let index = 0; index < requiredFields.length; index++) {
            if (body[requiredFields[index]] == '' || body[requiredFields[index]] == undefined) {
                throw new Error(`Required field ${requiredFields[index]} was not filled`)
            }
        }

        const putParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: id,
            },
            UpdateExpression: "set #oldName = :newName, #oldDescription = :newDescription, #oldShowDate = :newShowDate",
            ExpressionAttributeNames: {
                "#oldName": "name",
                "#oldDescription": "description",
                "#oldShowDate": "showDate"
            },
            ExpressionAttributeValues: {
                ":newName": body.name,
                ":newDescription": body.description,
                ":newShowDate": showDate
            }
        };
        await dynamoDB.update(putParams).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ putParams, expressions})
        };

    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify(error.message)
        }

    }
};