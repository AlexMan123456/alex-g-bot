const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
.setName("github")
.setDescription("Link to GitHub repository for this bot")

async function execute(interaction){
    await interaction.reply("Here's the GitHub repository for my code: https://github.com/AlexMan123456/alex-g-bot")
}

module.exports = { data, execute }