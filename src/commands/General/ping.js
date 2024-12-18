const { Command } = require('@sapphire/framework')


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
		await interaction.reply("Pong")
	}
}

module.exports = {PingCommand}