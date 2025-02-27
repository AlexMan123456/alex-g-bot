const { Command } = require("@sapphire/framework");

class NeurosongsCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("neurosongs")
            .setDescription("Link to the bot creator's music sharing website")
        })
    }

    async chatInputRun(interaction){
        await interaction.reply("Here is the link to Neurosongs: https://neurosongs.netlify.app")
    }
}

module.exports = {NeurosongsCommand}