const { stripIndents } = require("common-tags")
const { setNewLeaveMessage } = require("../../database-interactions/guilds.js")

async function setLeaveMessage(interaction){
    const message = interaction.options.getString("message") ?? "{user} has left {guild}"
    try {
        const guild = await setNewLeaveMessage(interaction.guild.id, message)
        await interaction.reply(
            stripIndents(`**New Leave Message**
            ${guild.leave_message}
            `))
    } catch(err) {
        await interaction.reply({content: `${err}`, ephemeral: true})
    }
}

module.exports = setLeaveMessage