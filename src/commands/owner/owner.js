const { Subcommand } = require("@sapphire/plugin-subcommands");
const queryDatabase = require("../../subcommand-logic/owner/query-database.js");
const evalCommand = require("../../subcommand-logic/owner/eval.js");
const addUserToDatabase = require("../../subcommand-logic/owner/add-user-to-db.js");

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
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
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
                                .setDescription("(OWNER ONLY) The user to add to the database")
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
}

module.exports = {OwnerCommand}