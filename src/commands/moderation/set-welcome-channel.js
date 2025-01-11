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
                .setName("set-welcome-channel")
                .setDescription("Set the channel for welcome messages to be sent")
                .addChannelOption((option) => {
                    return option
                        .setName("channel")
                        .setDescription("The channel to send welcome messages to")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const welcomeChannel = interaction.options.getChannel("channel")
        try {
            const guild = await patchGuild(interaction.guild.id, {welcome_channel_id: welcomeChannel.id})
            await interaction.reply(`Welcome messages will now be sent to <#${guild.welcome_channel_id}>.`)
        } catch(err) {
            await interaction.reply({content: "Error setting welcome channel.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {setWelcomeLeaveChannelCommand}