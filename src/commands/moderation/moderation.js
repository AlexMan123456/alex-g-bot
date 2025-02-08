const { Subcommand } = require("@sapphire/plugin-subcommands");
const { removeUserFromGuild } = require("../../database-interactions/users-and-guilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");
const { postPunishment } = require("../../database-interactions/punishments");
const { PunishmentType } = require("@prisma/client");
const DMUser = require("../../utils/dm-user");
const kickOrBan = require("../../miscellaneous/kick-or-ban");

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
        await kickOrBan(interaction, PunishmentType.kick);
    }

    async chatInputBan(interaction){
        await kickOrBan(interaction, PunishmentType.ban);
    }
}

module.exports = {ModerationCommand}