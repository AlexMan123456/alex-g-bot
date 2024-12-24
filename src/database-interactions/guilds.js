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

module.exports = { postGuild, getGuildById }