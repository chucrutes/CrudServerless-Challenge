'use strict'
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const httpResponse = require('../httpResponse');
const dateValidator = require('../dateValidator');
const verifyRequiredFields = require('../requiredFields');

module.exports.handle = async (event) => {
    const body = JSON.parse(event.body)
    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    try {
        const dateValidated = dateValidator(body.showDate)
        verifyRequiredFields(body)
        
        const putParams = {
            Item: {
                primary_key: uuidv4(),
                name: body.name,
                description: body.description,
                createdAt: new Date().toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  }),
                showDate: dateValidated.toLocaleString()
            },
            TableName: process.env.DYNAMODB_SHOW_TABLE
        };
        await dynamoDB.put(putParams).promise();

        httpResponse.statusCode = 201
        httpResponse.body =  JSON.stringify({message: "Item created successfully", putParams })

        return httpResponse

    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body =  JSON.stringify({error: error.message })
        
        return httpResponse

    }
};