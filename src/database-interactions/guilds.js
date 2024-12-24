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

module.exports = postGuild