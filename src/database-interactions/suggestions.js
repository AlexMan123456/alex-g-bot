const { container } = require("@sapphire/framework")
const { database } = container

function postSuggestion(suggestion, user_id){
    const {title, description} = suggestion
    return database.suggestion.create({
        data: {user_id, title, description}
    }).then((suggestion) => {
        return suggestion
    })
}

module.exports = { postSuggestion }