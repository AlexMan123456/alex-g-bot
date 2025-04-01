const { Command, container } = require('@sapphire/framework')
const logError = require('../../utils/log-error')
const { EmbedBuilder } = require('discord.js')

class PingCommand extends Command {
	constructor(context, options){
		super(context, {...options})
	}

	registerApplicationCommands(registry){
		registry.registerChatInputCommand((builder) => {
			builder.setName("ping").setDescription("Replies with pong")
		})
	}

	async chatInputRun(interaction){
		let replied = false;
		try {
			const message = await interaction.reply("Pong");
			replied = true;
			
			const uptime = new Date(Date.now() - container.startTime.getTime()).getMinutes()

			const embed = new EmbedBuilder()
			.setTitle("Ping pong!")
			.setColor("Green")
			.addFields(
				{name: "Bot latency", value: `${Date.now() - message.createdTimestamp}ms`},
				{name: "Uptime", value: `${uptime} ${uptime === 1 ? "minute" : "minutes"}`}
			)
			.setImage("https://www.icegif.com/wp-content/uploads/2023/01/icegif-162.gif");

			await message.edit({embeds: [embed]});
		} catch(err) {
			const errorMessage = {content: "My code is so bad, it fails at even just a simple ping command!", ephemeral: true};
			!replied ? await interaction.reply(errorMessage) : null;
			await logError(interaction, err);
		}
	}
}

module.exports = {PingCommand}