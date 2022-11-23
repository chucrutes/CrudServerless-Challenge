'use strict'
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const httpResponse = require('../httpResponse')

module.exports.handle = async (event) => {
    const body = JSON.parse(event.body)
    const dynamoDB = new AWS.DynamoDB.DocumentClient()

    const requiredFields = ['name', 'showDate']
    const showDate = new Date(body.showDate)
    const currentDate = new Date()

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
            Item: {
                primary_key: uuidv4(),
                name: body.name,
                description: body.description,
                createdAt: new Date().toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  }),
                showDate: showDate.toLocaleString()
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