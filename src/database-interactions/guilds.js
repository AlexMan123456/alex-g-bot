const { container } = require("@sapphire/framework")
const { database } = container

function postGuild(guild){
    return database.guild.create({
        data: {
            guild_id: guild.id,
            name: guild.name
        }
    }).then((guild) => {
        return guild
    })
}

function getGuildById(guild_id){
    return database.guild.findUnique({
        where: {guild_id}
    }).then((guild) => {
        return guild
    })
}

function setNewWelcomeMessage(guild_id, welcome_message){
    return database.guild.update({
        where: {guild_id},
        data: {welcome_message}
    }).then((guild) => {
        return guild
    })
}

function setNewLeaveMessage(guild_id, leave_message){
    return database.guild.update({
        where: {guild_id},
        data: {leave_message}
    }).then((guild) => {
        return guild
    })
}

module.exports = { postGuild, getGuildById, setNewWelcomeMessage, setNewLeaveMessage }