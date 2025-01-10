const { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require("discord.js")

async function evalCommand(interaction){
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

module.exports = evalCommand