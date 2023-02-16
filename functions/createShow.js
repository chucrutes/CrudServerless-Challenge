'use strict'
const { v4: uuidv4 } = require('uuid');
const httpResponse = require('../utils/httpResponse');
const dateValidator = require('../utils/dateValidator');
const verifyRequiredFields = require('../utils/requiredFields');
const {save} = require('../utils/dynamodb')

module.exports.handle = async (event) => {
    const body = JSON.parse(event.body)
    console.log(body)

    try {
        const dateValidated = dateValidator(body.showDate)
        const requiredFields = ['name', 'description', 'tickets', 'showDate']
        verifyRequiredFields(body, requiredFields)
        
        const putParams = {
            Item: {
                primary_key: uuidv4(),
                name: body.name,
                description: body.description,
                tickets: body.tickets,
                ticketsLeft: body.tickets,
                createdAt: new Date().toLocaleString("pt-BR", {
                    timeZone: "America/Sao_Paulo",
                  }),
                showDate: dateValidated.toLocaleString()
            },
            TableName: process.env.DYNAMODB_SHOW_TABLE
        };
        await save(putParams);

        httpResponse.statusCode = 201
        httpResponse.body =  JSON.stringify({message: "Item created successfully", putParams })

        return httpResponse

    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body =  JSON.stringify({error: error.message })
        
        return httpResponse

    }
};