const { Command } = require("@sapphire/framework");
const { patchGuild } = require("../../database-interactions/guilds");
const logError = require("../../utils/log-error");

class setWelcomeLeaveChannelCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: [["OwnerOnly", "ModOnly"]]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("set-leave-channel")
                .setDescription("Set the channel for leave messages to be sent")
                .addChannelOption((option) => {
                    return option
                        .setName("channel")
                        .setDescription("The channel to send leave messages to")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const leaveChannel = interaction.options.getChannel("channel")
        try {
            const guild = await patchGuild(interaction.guild.id, {leave_channel_id: leaveChannel.id})
            await interaction.reply(`Leave messages will now be sent to <#${guild.leave_channel_id}>.`)
        } catch(err) {
            await interaction.reply({content: "Error setting leave channel.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {setWelcomeLeaveChannelCommand}