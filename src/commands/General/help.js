const { Command } = require("@sapphire/framework");

class HelpCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("help")
            .setDescription("Get a link to the documentation site detailing commands")
        })
    }

    async chatInputRun(interaction){
        try {
            await interaction.reply("Here's a link to the documentation of my commands: https://alex-g-bot-docs.netlify.app")
        } catch(err) {
            await interaction.reply({content: "Error getting documentation. Please try again later.", ephemeral: true})
        }
    }
}

module.exports = {HelpCommand}