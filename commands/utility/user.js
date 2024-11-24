const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

async function execute(interaction){
	const user = interaction.user
	const member = interaction.member

	const embed = new EmbedBuilder()
		.setTitle(user.globalName)
		.setAuthor({name: user.username})
		.addFields(
			{name: "Global name:", value: user.globalName},
			{name: "Username:", value: user.username},
			{name: "Joined server on:", value: String(member.joinedAt)}
		)

	await interaction.reply({embeds: [embed]})
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.'),
	execute,
};