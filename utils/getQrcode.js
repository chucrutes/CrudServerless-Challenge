const axios = require('axios').default;

module.exports = async function sendMessage(ticketId){

    let createQr = axios.create({
        baseURL: 'http://api.qrserver.com',
        responseType: 'json'
    });

    const response = await createQr.get(`/v1/create-qr-code/?data=${ticketId}!&size=100x100`);

    return response
}