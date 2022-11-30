function verifyRequiredFields(body){
    const requiredFields = ['name', 'showDate']

    for (let index = 0; index < requiredFields.length; index++) {
        if (body[requiredFields[index]] == '' || body[requiredFields[index]] == undefined) {
            throw new Error(`Required field ${requiredFields[index]} was not filled`)
        }
    }
    return true

}
module.exports = verifyRequiredFields