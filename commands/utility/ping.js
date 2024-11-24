const { SlashCommandBuilder } = require('discord.js');

async function execute(interaction){
	await interaction.reply("pong")
}

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with pong'),
	execute,
};