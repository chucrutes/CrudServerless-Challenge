"use strict";

const httpResponse = require('../utils/httpResponse');
const {getAll} = require('../utils/dynamodb')


module.exports.handle = async (_) => {

  const scanParams = {
    TableName: process.env.DYNAMODB_SHOW_TABLE
  }

  const result = await getAll(scanParams)
  var item;

  if (result.Count === 0) {
    item = 'No items in database'
  } else {

    item = await result.Items.map((show) => {
      return {
        pk: show.primary_key,
        name: show.name,
        description: show.description,
        showDate: show.showDate
      }
    })

  }
  httpResponse.statusCode = 200
  httpResponse.message = result.Count, item

  return httpResponse

};
