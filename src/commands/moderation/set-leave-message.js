const { Command } = require("@sapphire/framework");
const setLeaveMessage = require("../../miscellaneous/owner-subcommands/set-leave-message");

class LeaveCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("set-leave-message")
                .setDescription("Set a custom leave message for your guild")
                        .addStringOption((option) => {
                            return option
                                .setName("message")
                                .setDescription("The new leave message (leave blank to reset to default)")
                        })
        })
    }

    async chatInputRun(interaction){
        return await setLeaveMessage(interaction)
    }
}

module.exports = {LeaveCommand}