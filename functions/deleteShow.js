'use strict'
const AWS = require('aws-sdk');
const httpResponse = require('../httpResponse')


module.exports.handle = async (event) => {
    const id = event.pathParameters.id
    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    try {
        const putParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: id,
            }
        };
       const query = await dynamoDB.delete(putParams).promise();

        httpResponse.status = 201
        httpResponse.message = "Item deleted successfully"
        
        return httpResponse
        
    } catch (error) {
        httpResponse.status = 404
        httpResponse.message = error.message

        return httpResponse

    }
};