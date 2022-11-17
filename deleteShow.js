"use strict";

const AWS = require('aws-sdk')

module.exports.handle = async (_) => {

  const scanParams = {
    TableName: process.env.DYNAMODB_SHOW_TABLE
  }

  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const result = await dynamodb.scan(scanParams).promise()
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
  return {
    statusCode: 200,
    body: JSON.stringify({
      total: result.Count,
      item
    })
  }

};
