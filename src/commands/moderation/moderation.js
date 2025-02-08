const { Subcommand } = require("@sapphire/plugin-subcommands");
const { removeUserFromGuild } = require("../../database-interactions/users-and-guilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");
const { postKick } = require("../../database-interactions/punishments");
const { PunishmentType } = require("@prisma/client");
const DMUser = require("../../utils/dm-user");

class ModerationCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "kick",
                    chatInputRun: "chatInputKick",
                    preconditions: [["OwnerOnly", "ModOnly"]]
                },
                {
                    name: "ban",
                    chatInputRun: "chatInputBan",
                    preconditions: [["OwnerOnly", "ModOnly"]]
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
            .addSubcommand((command) => {
                return command
                .setName("ban")
                .setDescription("Ban a user from the server")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to ban")
                    .setRequired(true)
                })
                .addStringOption((option) => {
                    return option
                    .setName("reason")
                    .setDescription("The reason for the ban")
                })
            })
        })
    }

    async chatInputKick(interaction){
        try {
            const userToKick = interaction.options.getMember("user");
            const reason = interaction.options.getString("reason");
            
            const punishmentData = {user_id: userToKick.id, guild_id: interaction.guild.id, type: PunishmentType.kick};
            if(reason){
                punishmentData.reason = reason;
            }

            await postKick(punishmentData);
            const embed = new EmbedBuilder()
            .setTitle(`You have been kicked from _${interaction.guild.name}_ by ${interaction.user.globalName}`)
            .setColor("Red")
            .addFields({name: "Reason", value: reason ?? "Unspecified"});

            await DMUser(userToKick, {embeds: [embed]});
            userToKick.kick(reason);
            
            embed.setTitle(`${userToKick.user.username} kicked successfully`)
            .setAuthor({name: interaction.user.globalName})
            .setColor("Green")

            await interaction.reply({embeds: [embed]});
        } catch(err) {
            await interaction.reply({content: "Error kicking user", ephemeral: true});
            await logError(interaction, err);
        }
    }

    async chatInputBan(interaction){
        try {

        } catch(err) {
            await interaction.reply({content: "Error banning user", ephemeral: true});
            await logError(interaction, err);
        }
    }
}

module.exports = {ModerationCommand}