'use strict'
const AWS = require('aws-sdk');
const expressionGenerator = require('../expressionGenerator');


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
        await dynamoDB.delete(putParams).promise();

        return {
            statusCode: 201,
            body: JSON.stringify({message: "Item deleted successfully", putParams})
        };

    } catch (error) {
        return {
            statusCode: 404,
            body: JSON.stringify(error.message)
        }

    }
};