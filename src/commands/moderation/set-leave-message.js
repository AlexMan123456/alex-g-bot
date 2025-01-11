const { Command } = require("@sapphire/framework");
const { stripIndents } = require("common-tags");
const logError = require("../../utils/log-error");
const { patchGuild } = require("../../database-interactions/guilds");

class LeaveCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: [["OwnerOnly", "ModOnly"]]
        })
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
        const leave_message = interaction.options.getString("message") ?? "{user} has left {guild}"
        try {
            const guild = await patchGuild(interaction.guild.id, {leave_message})
            await interaction.reply(
                stripIndents(`**New Leave Message**
                ${guild.leave_message}
                `))
        } catch(err) {
            await interaction.reply({content: "Error setting leave message.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {LeaveCommand}