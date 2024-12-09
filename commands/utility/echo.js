const { SlashCommandBuilder, MessageFlags } = require("discord.js")

const data = new SlashCommandBuilder()
.setName("echo")
.setDescription("Returns the given input")
.addStringOption((option) => {
    return option
        .setName("input")
        .setDescription("The input to echo back")
})

async function execute(interaction){
    try{
        await interaction.reply(interaction.options.getString("input"))
    }catch(err){
        await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
    }
}

module.exports = { data, execute }