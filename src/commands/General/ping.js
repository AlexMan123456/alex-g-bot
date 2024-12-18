const { Command } = require('@sapphire/framework')
const { MessageFlags } = require('discord.js')


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
			await interaction.reply("Pong")
		} catch(err) {
			await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
		}
	}
}

module.exports = {PingCommand}