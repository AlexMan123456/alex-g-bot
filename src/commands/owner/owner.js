const { Subcommand } = require("@sapphire/plugin-subcommands");
const { patchGuild } = require("../../database-interactions/guilds");
const logError = require("../../utils/log-error");
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

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
                    name: "eval",
                    chatInputRun: "chatInputEval"
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
                        .setName("eval")
                        .setDescription("Evaluates some JavaScript code")
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

    async chatInputEval(interaction){
        const modal = new ModalBuilder()
        .setCustomId("Eval")
        .setTitle("Eval")

        const codeInput = new TextInputBuilder()
        .setCustomId("code")
        .setLabel("Enter your code here")
        .setStyle(TextInputStyle.Paragraph)
        
        const stringifyOutput = new TextInputBuilder()
        .setCustomId("lineSpacing")
        .setLabel("Set line spacing of output")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

        const codeRow = new ActionRowBuilder().addComponents(codeInput)
        const stringifyRow = new ActionRowBuilder().addComponents(stringifyOutput)
        modal.addComponents(codeRow, stringifyRow)

        await interaction.showModal(modal)
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