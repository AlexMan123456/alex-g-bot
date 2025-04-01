const { Command } = require("@sapphire/framework");
const { version } = require("../../../package.json")

class VersionCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((command) => {
            return command
            .setName("version")
            .setDescription("See the current version number of the bot")
        })
    }

    async chatInputRun(interaction){
        await interaction.reply(`Current version: v${version}`)
    }
}

module.exports = VersionCommand