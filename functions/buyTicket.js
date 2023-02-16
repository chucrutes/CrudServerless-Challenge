"use strict";

const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const generateQR = require('../utils/generateQr');
const { queryById } = require('../utils/queries/');
const httpResponse = require('../utils/httpResponse');
const { sendEmail } = require('../utils/config/ses');
const { save, getItem, update } = require('../utils/dynamodb');
const expressionGenerator = require('../utils/expressionGenerator');


const domain = "https://ag0r4l2x9g.execute-api.us-east-1.amazonaws.com/ticket/validate"

module.exports.handle = async (event) => {
    try {
        const showId = event.pathParameters.id
        const body = JSON.parse(event.body)
        const { cpf, email } = body
        const ticketId = uuidv4()
        const queryParams = queryById(process.env.DYNAMODB_SHOW_TABLE, showId)
        const { Items, Count } = await getItem(queryParams)
        const show = Items[0]
        let ticketsLeft = show.ticketsLeft

        if (Count == 0) {
            throw new Error('Show not found in the database')
        }

        if (ticketsLeft == 0) {
            throw new Error('No tickets available for this show')
        }
        ticketsLeft--

        const fields = {
            ticketsLeft: ticketsLeft,
            cpf
        }

        const expression = expressionGenerator(fields, ['ticketsLeft'])

        const updateParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: showId,
            },
            UpdateExpression: expression.updateExpression,
            ExpressionAttributeNames: expression.expressionAttributeNames,
            ExpressionAttributeValues: expression.expressionAttributeValues
        }

        await update(updateParams)

        const putParams = {
            Item: {
                primary_key: ticketId,
                showId,
                cpf,
                read: false
            },
            TableName: process.env.DYNAMODB_TICKETS_TABLE
        }

        await save(putParams);

        const qr = await generateQR(`${ticketId}`)
        console.log(qr)
        const resizedImageFileBuffer = await sharp(qr)
            .resize ({ width:200, height:200, fit: 'contain' })
            .toFormat('png')
            .png({ quality:100, compressionLevel: 6 })
            .toBuffer()
        const template = `<html><body><h1>Here it is your qrcode</h1><img src="${resizedImageFileBuffer}" alt="qrcode image"></body></html>`
        console.log(template)


        const data = await sendEmail(template, email, show.name);
        console.log(data);
        return {
            headers: {
                "content-type": "application/json"
            },
            statusCode: 200,
            body: qr
        }

    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: error.message })
        return httpResponse
    }


};
