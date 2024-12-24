const { Subcommand } = require("@sapphire/plugin-subcommands");
const queryDatabase = require("../../subcommand-logic/owner/query-database.js");
const evalCommand = require("../../subcommand-logic/owner/eval.js");

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
}

module.exports = {OwnerCommand}