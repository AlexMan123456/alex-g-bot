const { SuggestionStatus } = require("@prisma/client")
const { container } = require("@sapphire/framework")
const { database } = container

const allAttributes = {
    title: true,
    description: true,
    status: true,
    author: {
        select: {
            user_id: true,
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

function patchSuggestion(suggestion_id, status){
    return database.suggestion.update({
        where: {suggestion_id},
        data: {
            status: SuggestionStatus[status]
        },
        select: allAttributes
    }).then((suggestion) => {
        return suggestion
    })
}

module.exports = { postSuggestion, getSuggestion, patchSuggestion }