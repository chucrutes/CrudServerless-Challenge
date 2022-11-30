'use strict'

const AWS = require('aws-sdk');const httpResponse = require('../utils/httpResponse')
const {destroy} = require('../utils/dynamodb')



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
        
       destroy(putParams)

        httpResponse.statusCode = 202
        httpResponse.body = JSON.stringify({ message: "Item deleted successfully", putParams })

        return httpResponse

    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: error.message })

        return httpResponse

    }
};