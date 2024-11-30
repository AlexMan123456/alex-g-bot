const { SlashCommandBuilder } = require("discord.js")

async function execute(interaction){
    await interaction.reply(interaction.options.getString("input"))
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("Returns the given input")
        .addStringOption((option) => {
            return option
                .setName("input")
                .setDescription("The input to echo back")
        }),
    execute
}