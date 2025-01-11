const { EmbedBuilder } = require("discord.js")
const findChannel = require("./find-channel")
const { getGuildById } = require("../database-interactions/guilds")

function logError(client, error){
    return getGuildById(client.guild.id).then((guild) => {
        return client.guild.channels.cache.get(guild.error_log_id)
    }).then((errorChannel) => {
        const errorMessage = new EmbedBuilder()
        .setTitle("An error has occured")
        .setDescription(`${error}`)
        .setColor("Red")

        errorChannel.send({embeds: [errorMessage]})
    })
}

module.exports = logError