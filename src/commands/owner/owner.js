const { Subcommand } = require("@sapphire/plugin-subcommands");
const queryDatabase = require("../../miscellaneous/owner-subcommands/query-database");
const evalCommand = require("../../miscellaneous/owner-subcommands/eval");
const addUserToDatabase = require("../../miscellaneous/owner-subcommands/add-user-to-db");
const addGuildToDatabase = require("../../miscellaneous/owner-subcommands/add-guild-to-db");
const addUserToGuild = require("../../miscellaneous/owner-subcommands/add-user-to-guild");
const setWelcomeMessage = require("../../miscellaneous/owner-subcommands/set-welcome-message");
const setLeaveMessage = require("../../miscellaneous/owner-subcommands/set-leave-message");
const { patchGuild } = require("../../database-interactions/guilds");
const logError = require("../../utils/log-error");

class OwnerCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options, 
            name: "owner",
            preconditions: ["OwnerOnly"],
            subcommands: [
                {
                    name: "test",
                    chatInputRun: "chatInputTest",
                    default: true
                },
                {
                    name: "query-database",
                    chatInputRun: "chatInputQueryDatabase"
                },
                {
                    name: "eval",
                    chatInputRun: "chatInputEval"
                },
                {
                    name: "add-user-to-db",
                    chatInputRun: "chatInputAddUserToDatabase"
                },
                {
                    name: "add-guild-to-db",
                    chatInputRun: "chatInputAddGuildToDatabase"
                },
                {
                    name: "add-user-to-guild",
                    chatInputRun: "chatInputAddUserToGuild"
                },
                {
                    name: "set-welcome-message",
                    chatInputRun: "chatInputSetWelcomeMessage"
                },
                {
                    name: "set-leave-message",
                    chatInputRun: "chatInputSetLeaveMessage"
                },
                {
                    name: "set-mod-role",
                    chatInputRun: "chatInputSetModRole"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("owner")
                .setDescription("Commands only the owner can run")
                .addSubcommand((command) => {
                    return command
                        .setName("test")
                        .setDescription("Show a secret message if run by owner")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("query-database")
                        .setDescription("Query the database using a raw SQL string")
                        .addStringOption((option) => {
                            return option
                                .setName("query")
                                .setDescription("The query string")
                                .setRequired(true)
                        })
                })
                .addSubcommand((command) => {
                    return command
                        .setName("eval")
                        .setDescription("Evaluates some JavaScript code")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("add-user-to-db")
                        .setDescription("Add a user to the bot's database")
                        .addUserOption((option) => {
                            return option
                                .setName("user")
                                .setDescription("The user to add to the database")
                                .setRequired(true)
                        })
                })
                .addSubcommand((command) => {
                    return command
                        .setName("add-guild-to-db")
                        .setDescription("Add a guild to the bot's database")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("add-user-to-guild")
                        .setDescription("Add a user to a guild in the bot's database")
                        .addUserOption((option) => {
                            return option
                                .setName("user")
                                .setDescription("The user to add to the guild the command is being run in")
                        })
                })
                .addSubcommand((command) => {
                    return command
                        .setName("set-mod-role")
                        .setDescription("Set the mod role of your server")
                        .addRoleOption((option) => {
                            return option
                                .setName("role")
                                .setDescription("The role to set as a mod role")
                                .setRequired(true)
                        })
                })
        })
    }

    async chatInputTest(interaction){
        try {
            await interaction.reply(`${interaction.user.username} is the best user`)
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }

    async chatInputQueryDatabase(interaction){
        await queryDatabase(interaction)
    }

    async chatInputEval(interaction){
        await evalCommand(interaction)
    }

    async chatInputAddUserToDatabase(interaction){
        await addUserToDatabase(interaction)
    }

    async chatInputAddGuildToDatabase(interaction){
        await addGuildToDatabase(interaction)
    }

    async chatInputAddUserToGuild(interaction){
        await addUserToGuild(interaction)
    }

    async chatInputSetModRole(interaction){
        const {id: mod_role_id} = interaction.options.getRole("role")
        
        try {
            await patchGuild(interaction.guild.id, {mod_role_id})
            await interaction.reply(`Mod role set to <@&${mod_role_id}>.`)
        } catch(err) {
            await interaction.reply("Could not set mod role.")
            await logError(interaction, err)
        }
    }
}

module.exports = {OwnerCommand}