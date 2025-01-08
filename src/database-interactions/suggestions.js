const { container } = require("@sapphire/framework")
const { database } = container

const allAttributes = {
    title: true,
    description: true,
    resolved: true,
    author: {
        select: {
            global_name: true
        }
    }
}

function postSuggestion(suggestion, user_id){
    const {suggestion_id, title, description} = suggestion
    return database.suggestion.create({
        data: {suggestion_id, user_id, title, description},
        select: allAttributes
    }).then((suggestion) => {
        return suggestion
    })
}

function getSuggestion(suggestion_id){
    return database.suggestion.findUnique({
        where: {suggestion_id},
        select: allAttributes
    }).then((suggestion) => {
        return suggestion
    })
}

function patchSuggestion(suggestion_id, resolved){
    return database.suggestion.update({
        where: {suggestion_id},
        data: {resolved},
        select: allAttributes
    }).then((suggestion) => {
        return suggestion
    })
}

module.exports = { postSuggestion, getSuggestion, patchSuggestion }