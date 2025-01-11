const { Command } = require("@sapphire/framework");
const { patchGuild } = require("../../database-interactions/guilds");
const logError = require("../../utils/log-error");
const { stripIndents } = require("common-tags");

class WelcomeCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: [["OwnerOnly", "ModOnly"]]
        })
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
        const welcome_message = interaction.options.getString("message") ?? "{user} has joined {guild}"
        try {
            const guild = await patchGuild(interaction.guild.id, {welcome_message})
            await interaction.reply(
                stripIndents(`**New Welcome Message**
                ${guild.welcome_message}
                `))
        } catch(err) {
            await interaction.reply({content: "Error setting welcome message.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {WelcomeCommand}