const { Command } = require("@sapphire/framework");
const { patchGuild } = require("../../database-interactions/guilds");

class SetErrorLogCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: [["OwnerOnly", "ModOnly"]]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("set-error-log")
                .setDescription("Set a channel for errors to be logged")
                .addChannelOption((option) => {
                    return option
                        .setName("channel")
                        .setDescription("The channel to send errors to")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const errorLog = interaction.options.getChannel("channel")
        try {
            const guild = await patchGuild(interaction.guild.id, {error_log_id: errorLog.id})
            await interaction.reply(`Error log set to <#${guild.error_log_id}>`)
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }

    }
}

module.exports = {SetErrorLogCommand}