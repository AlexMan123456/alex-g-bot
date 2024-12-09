const { SlashCommandBuilder } = require("discord.js")

const data = new SlashCommandBuilder()
.setName("echo")
.setDescription("Returns the given input")
.addStringOption((option) => {
    return option
        .setName("input")
        .setDescription("The input to echo back")
})

async function execute(interaction){
    await interaction.reply(interaction.options.getString("input"))
}

module.exports = { data, execute }