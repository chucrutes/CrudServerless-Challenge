"use strict";

const { getItem } = require('../utils/dynamodb');
const httpResponse = require('../utils/httpResponse');
const { ticketsPerCpf, queryById } = require('../utils/queries');


module.exports.handle = async (event) => {

    try{
        const cpf = event.pathParameters.id

        const scanParams = ticketsPerCpf(process.env.DYNAMODB_TICKETS_TABLE, cpf)
        const { Items, Count } = await getAll(scanParams)
       
        if(Count == 0){
            throw new Error('No items found')
        }

        for(let i = 0; i < Count; i++){
            const queryParams = queryById(process.env.DYNAMODB_SHOW_TABLE, Items[i].showId)
            Items[i].showName = await getItem(queryParams)
        }

        httpResponse.statusCode = 200
        httpResponse.body = JSON.stringify({ Items })
        return httpResponse
    }catch(e){
        httpResponse.statusCode = 400
        httpResponse.body = JSON.stringify({ error: e.message })
        return httpResponse
    }
  


};
