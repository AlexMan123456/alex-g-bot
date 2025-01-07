const { Command } = require('@sapphire/framework')
const logError = require('../../utils/log-error')

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
			await interaction.reply({content: "My code is so bad, it fails at even just a simple ping command!", ephemeral: true})
			await logError(interaction, err)
		}
	}
}

module.exports = {PingCommand}