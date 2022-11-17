'use strict'

const AWS = require('aws-sdk');
const expressionGenerator = require('../expressionGenerator');

module.exports.handle = async (event) => {
    const dynamoDB = new AWS.DynamoDB.DocumentClient()
    const body = JSON.parse(event.body)
    const id = event.pathParameters.id
    
    const requiredFields = ['name', 'showDate']
    var expressions = expressionGenerator(body)
    
    try {

        if(body.showDate != undefined){

            const showDate = new Date(body.showDate)
            const currentDate = new Date()

            if (showDate == 'Invalid Date' || showDate.getTime() < currentDate.getTime()) {
                throw new Error('Invalid Date')
            }
        }

        for (let index = 0; index < requiredFields.length; index++) {
            if (body[requiredFields[index]] == '') {
                throw new Error(`Required field ${requiredFields[index]} was not filled`)
            }
        }

        const putParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: id,
            },
        };
        await dynamoDB.update(putParams).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Item updated successfully", putParams})
        };

    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify(error.message)
        }

    }
};