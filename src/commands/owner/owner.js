const { Subcommand } = require("@sapphire/plugin-subcommands");
const queryDatabase = require("../../subcommand-logic/owner/query-database.js");
const evalCommand = require("../../subcommand-logic/owner/eval.js");
const addUserToDatabase = require("../../subcommand-logic/owner/add-user-to-db.js");
const addGuildToDatabase = require("../../subcommand-logic/owner/add-guild-to-db.js");
const addUserToGuild = require("../../subcommand-logic/owner/add-user-to-guild.js");

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
}

module.exports = {OwnerCommand}