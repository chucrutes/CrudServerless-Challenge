'use strict'

const httpResponse = require('../utils/httpResponse');
const {destroy} = require('../utils/dynamodb');



module.exports.handle = async (event) => {
    const {id} = event.pathParameters

    try {
        const putParams = {
            TableName: process.env.DYNAMODB_SHOW_TABLE,
            Key: {
                primary_key: id,
            },
            ReturnValues: "ALL_OLD"
        };
        
       const {Attributes} = await destroy(putParams)
       
       console.log(Attributes)
       if(Attributes == undefined){
        throw new Error('Item not found')
       }

        httpResponse.statusCode = 202
        httpResponse.body = JSON.stringify({ message: "Item deleted successfully", putParams })

        return httpResponse

    } catch (error) {
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: error.message })

        return httpResponse

    }
};