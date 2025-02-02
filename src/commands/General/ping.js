const { Command } = require('@sapphire/framework')
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
		try {
			const message = await interaction.reply("Pong")

			const embed = new EmbedBuilder()
			.setTitle("Ping pong!")
			.setColor("Green")
			.addFields({name: "Bot latency", value: `${Date.now() - message.createdTimestamp}ms`})

			await message.edit({embeds: [embed]})
		} catch(err) {
			await interaction.reply({content: "My code is so bad, it fails at even just a simple ping command!", ephemeral: true})
			await logError(interaction, err)
		}
	}
}

module.exports = {PingCommand}