"use strict";

const { save, getItem, update } = require('../utils/dynamodb');
const httpResponse = require('../utils/httpResponse');
const queryById = require('../utils/queries/queryById');
const expressionGenerator = require('../utils/expressionGenerator');
const getQr = require('../utils/getQrcode');
const { v4: uuidv4 } = require('uuid');



module.exports.handle = async (event) => {

    try {
        const showId = event.pathParameters.id
        const body = JSON.parse(event.body)
        const queryParams = queryById(process.env.DYNAMODB_SHOW_TABLE, showId)
        const ticketId = uuidv4()



        const { Items, Count } = await getItem(queryParams)

        const show = [Items]

        if (Count == 0) {
            throw new Error('Show not found in the database')
        }

        const qrcode = getQr(ticketId)

        const ticketsLeft = show.ticketsLeft - 1;

        const expression = expressionGenerator({ body: { ticketsLeft } }, ['ticketsLeft'])

        const updateParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: showId,
            },
            UpdateExpression: expression.updateExpression,
            ExpressionAttributeNames: expression.expressionAttributeNames,
            ExpressionAttributeValues: expression.expressionAttributeValues
        }
        await update(putParams)

        const putParams = {
            Item: {
                id: ticketId,
                showId,
                cpf: body.cpf
            },
            TableName: process.env.DYNAMODB_TICKETS_TABLE
        }

        await save(putParams);


        httpResponse.statusCode = 200
        httpResponse.body = JSON.stringify({ code: qrcode })
        return httpResponse
    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: error.message })
        return httpResponse
    }


};
