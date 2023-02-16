function verifyRequiredFields(body, requiredFields){
    const bodyFields = Object.keys(body)
    const fieldsToBeUpdated = bodyFields.filter((field) => requiredFields.includes(field))  
    console.log(fieldsToBeUpdated)  

    for (let index = 0; index < fieldsToBeUpdated.length; index++) {
        if (body[fieldsToBeUpdated[index]] == '' || body[fieldsToBeUpdated[index]] == undefined) {
            console.log(body[fieldsToBeUpdated])
            throw new Error(`Required field ${fieldsToBeUpdated[index]} was not filled`)
        }
    }
    return true

}

module.exports = verifyRequiredFields