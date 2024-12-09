const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
.setName('user')
.setDescription('Provides information about the user.')
.addUserOption((option) => {
	return option
		.setName("user")
		.setDescription("The username of the user to get information about")
})

async function execute(interaction){
	const user = interaction.options.getUser("user") ?? interaction.user
	const member = interaction.options.getMember("user") ?? interaction.member

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

module.exports = { data, execute };