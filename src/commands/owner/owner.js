const { Subcommand } = require("@sapphire/plugin-subcommands");

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
                    name: "test-two",
                    chatInputRun: "chatInputTestTwo"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("owner")
                .setDescription("Commands only Alex can run")
                .addSubcommand((command) => {
                    return command
                        .setName("test")
                        .setDescription("Show a secret message if run by owner")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("test-two")
                        .setDescription("Show another secret message if run by the owner")
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

    async chatInputTestTwo(interaction){
        try {
            await interaction.reply(`AlexGBot is the best bot`)
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }
}

module.exports = {OwnerCommand}