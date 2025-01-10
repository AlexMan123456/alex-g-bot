const { Command } = require("@sapphire/framework");
const setWelcomeMessage = require("../../miscellaneous/owner-subcommands/set-welcome-message");

class WelcomeCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("set-welcome-message")
                .setDescription("Set a custom welcome message for your guild")
                        .addStringOption((option) => {
                            return option
                                .setName("message")
                                .setDescription("The new welcome message (leave blank to reset to default)")
                        })
        })
    }

    async chatInputRun(interaction){
        return await setWelcomeMessage(interaction)
    }
}

module.exports = {WelcomeCommand}