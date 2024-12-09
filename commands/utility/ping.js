const { SlashCommandBuilder } = require('discord.js')

const data = new SlashCommandBuilder()
.setName('ping')
.setDescription('Replies with pong')

async function execute(interaction){
	await interaction.reply("pong")
}

module.exports = { cooldown: 5, data, execute }