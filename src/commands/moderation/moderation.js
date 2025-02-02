const { Subcommand } = require("@sapphire/plugin-subcommands");
const { removeUserFromGuild } = require("../../database-interactions/users-and-guilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");

class ModerationCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "kick",
                    chatInputRun: "chatInputKick"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("moderation")
            .setDescription("Moderation commands to help manage your server")
            .addSubcommand((command) => {
                return command
                .setName("kick")
                .setDescription("Kick a member from the server")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to kick")
                    .setRequired(true)
                })
                .addStringOption((option) => {
                    return option
                    .setName("reason")
                    .setDescription("The reason for kicking the user")
                })
            })
        })
    }

    async chatInputKick(interaction){
        try {
            const userToKick = interaction.options.getMember("user")
            const reason = interaction.options.getString("reason") ?? ""
            
            userToKick.kick(reason)
            
            const embed = new EmbedBuilder()
            .setTitle(`${userToKick.user.username} kicked successfully`)
            .setAuthor({name: interaction.user.globalName})
            .addFields({name: "Reason", value: reason ? reason : "Unspecified"})

            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Error kicking user", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {ModerationCommand}