function dateValidator(date) {
    if (date == undefined) {
        throw new Error('Invalid Date')
    }

    const showDate = new Date(date)
    const currentDate = new Date()

    if (showDate == 'Invalid Date' || showDate.getTime() < currentDate.getTime()) {
        throw new Error('Invalid Date')
    }
    return showDate
}

module.exports = dateValidator