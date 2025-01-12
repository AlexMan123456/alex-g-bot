const formatDateAndTime = require("./format-date-and-time")

function getCooldownExpiry(command){
    if(command === "economy daily-bonus"){
        return new Date(new Date().getTime() + 86400000)
    }
    return new Date()
}

module.exports = getCooldownExpiry