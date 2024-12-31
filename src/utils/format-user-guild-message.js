function formatUserGuildMessage(message, user, guild){
    const messageParts =  message.split(" ").map((token) => {
        if(token.includes("{user}")){
            return formatUsername(token, user)
        }
        if(token.includes("{guild}")){
            return formatGuild(token, guild)
        }
        return token
    }).join(" ")
    return messageParts
}

function formatUsername(token, user){
    for(let i=0; i<token.length-5; i++){
        if(token.slice(i,i+6) === "{user}"){
            return token.slice(0,i) + user + token.slice(i+6, token.length)
        }
    }
}

function formatGuild(token, guild){
    for(let i=0; i<token.length-6; i++){
        if(token.slice(i,i+7) === "{guild}"){
            return token.slice(0,i) + guild + token.slice(i+7,token.length)
        }
    }
}

module.exports = formatUserGuildMessage