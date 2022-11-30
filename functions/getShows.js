"use strict";

const { getAll } = require('../utils/dynamodb');
const httpResponse = require('../utils/httpResponse')

module.exports.handle = async (_) => {

    const scanParams = {
      TableName: process.env.DYNAMODB_SHOW_TABLE
    }

    const { Items, Count } = await getAll(scanParams)


    if (Count == 0) {
      httpResponse.statusCode = 200
      httpResponse.body = JSON.stringify({ count: Count, message: 'No items in the database' })
      return httpResponse
    }

      const item = await Items.map((show) => {
        return {
          pk: show.primary_key,
          name: show.name,
          description: show.description,
          showDate: show.showDate
        }
      })

    
    httpResponse.statusCode = 200
    httpResponse.body = JSON.stringify({ count: Count, items: item })
    return httpResponse


};
