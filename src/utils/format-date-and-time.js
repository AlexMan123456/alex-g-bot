function formatDateAndTime(dateTimeString){
    const dateTimeParts = dateTimeString.split("T")
    const dateParts = dateTimeParts[0].split("-")

    //make the year appear last (incoming date appears in YYYY-MM-DD format)
    dateParts.push(dateParts.shift())

    //switch the order of month and day (change format from MM-DD-YYYY to DD-MM-YYYY)
    const month = dateParts[0]
    const day = dateParts[1]
    dateParts[0] = day
    dateParts[1] = month
    const date = dateParts.join("/")

    //get only the hours and minutes from the time string
    const time = dateTimeParts[1].split(":").slice(0,2).join(":")
    return {date, time}
}

module.exports = formatDateAndTime