const { Command } = require("@sapphire/framework");
const { ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js");

class EvalCommand extends Command{
	constructor(context, options){
        super(context, {...options, preconditions: ["OwnerOnly"]})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("eval")
                .setDescription("Evaluates some JavaScript code")
        })
    }

    async chatInputRun(interaction){
        const modal = new ModalBuilder()
        .setCustomId("Eval")
        .setTitle("Eval")

    const codeInput = new TextInputBuilder()
        .setCustomId("code")
        .setLabel("Enter your code here")
        .setStyle(TextInputStyle.Paragraph)
    
    const stringifyOutput = new TextInputBuilder()
        .setCustomId("stringifyOutput")
        .setLabel("Do you want to stringify the output?")
        .setStyle(TextInputStyle.Short)
        .setRequired(false)

    const codeRow = new ActionRowBuilder().addComponents(codeInput)
    const stringifyRow = new ActionRowBuilder().addComponents(stringifyOutput)
    modal.addComponents(codeRow, stringifyRow)

    await interaction.showModal(modal)
    }
}

module.exports = {EvalCommand}