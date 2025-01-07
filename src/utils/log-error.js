const { EmbedBuilder } = require("discord.js")
const findChannel = require("./find-channel")

function logError(client, error){
    return findChannel(client, "error-log").then((errorChannelArray) => {
        return client.guild.channels.cache.get(errorChannelArray[0])
    }).then((errorChannel) => {
        const errorMessage = new EmbedBuilder()
        .setTitle("An error has occured")
        .setDescription(`${error}`)
        .setColor("Red")

        errorChannel.send({embeds: [errorMessage]})
    }).catch((err) => {
        const errorMessage = new EmbedBuilder()
        .setTitle("An error has occured")
        .setDescription(`${err}`)
        .setColor("Red")

        errorChannel.send({embeds: [errorMessage]})
    })
}

module.exports = logError