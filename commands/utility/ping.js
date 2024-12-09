const { SlashCommandBuilder, MessageFlags } = require('discord.js')

const data = new SlashCommandBuilder()
.setName('ping')
.setDescription('Replies with pong')

async function execute(interaction){
	try{
		await interaction.reply("pong")
	} catch(err){
		await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
	}
}

module.exports = { cooldown: 5, data, execute }