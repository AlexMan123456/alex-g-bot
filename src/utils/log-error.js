const { EmbedBuilder } = require("discord.js")
const { getGuildById } = require("../database-interactions/guilds")
const { container } = require("@sapphire/framework")
const util = require("util")

function logError(client, error){
    return getGuildById(client.guild.id).then((guild) => {
        return client.guild.channels.cache.get(guild.error_log_id)
    }).then((errorChannel) => {
        const errorMessage = new EmbedBuilder()
        .setTitle("An error has occured")
        .setDescription(util.inspect(error, { depth: 5 }))
        .setColor("Red")

        errorChannel.send({embeds: [errorMessage]})
    })
}

module.exports = logError