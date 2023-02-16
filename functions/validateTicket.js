"use strict";

const { getItem, update } = require('../utils/dynamodb');
const httpResponse = require('../utils/httpResponse');
const { queryById } = require('../utils/queries/');
const expressionGenerator = require('../utils/expressionGenerator');


module.exports.handle = async (event) => {

    try{

        const ticketId = event.pathParameters.id
        const queryParams = queryById(process.env.DYNAMODB_TICKETS_TABLE, ticketId)
        const { Items, Count } = await getItem(queryParams)
        if (Count == 0) {
            throw new Error('Ticket not found in the database')
        }
        const ticket = Items[0]

        if(ticket.read){
            throw new Error('This ticket has already been used')
        }

        const fields = {
            read: true
        }

        const expression = expressionGenerator(fields, ['read'])

        const updateParams = {
            TableName: process.env.DYNAMODB_TICKETS_TABLE,
            Key: {
                primary_key: ticketId,
            },
            UpdateExpression: expression.updateExpression,
            ExpressionAttributeNames: expression.expressionAttributeNames,
            ExpressionAttributeValues: expression.expressionAttributeValues
        }

        await update(updateParams)

        httpResponse.statusCode = 200
        httpResponse.body = JSON.stringify({ messsage: 'Ticket successfully read' })
        return httpResponse
    }catch(e){
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: e.message })
        return httpResponse
    }
  


};
