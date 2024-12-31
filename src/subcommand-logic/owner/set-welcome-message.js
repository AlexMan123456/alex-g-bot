const { setNewWelcomeMessage } = require("../../database-interactions/guilds.js")

async function setWelcomeMessage(interaction){
    const message = interaction.options.getString("message") ?? "{user} has joined {guild}"
    try {
        const guild = await setNewWelcomeMessage(interaction.guild.id, message)
        await interaction.reply(
            `**New Welcome Message**
            ${guild.welcome_message}
            `)
    } catch(err) {
        await interaction.reply({content: `${err}`, ephemeral: true})
    }
}

module.exports = setWelcomeMessage