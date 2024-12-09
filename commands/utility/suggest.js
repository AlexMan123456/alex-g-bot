const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js")

async function execute(interaction){
    const suggestionTitle = interaction.options.getString("title")
    const suggestionDescription = interaction.options.getString("description")

    const embed = new EmbedBuilder()
        .setTitle(suggestionTitle)
        .setAuthor({name: interaction.user.globalName})
        .addFields({name: "Details", value: suggestionDescription})
        .setTimestamp()

    try {
        const suggestionsChannel = await findSuggestionsChannel(interaction)
        await interaction.guild.channels.cache.get(suggestionsChannel[0]).send({embeds: [embed]})
        await interaction.reply({embeds: [embed], flags: MessageFlags.Ephemeral})
    } catch(err){
        await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
    }
}

function findSuggestionsChannel(interaction){
    return interaction.guild.channels.fetch().then((data) => {
        const channels = [...data]
        for(const channel of channels){
            if(channel[1].name === "suggestions"){
                return channel
            }
        }
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest a feature to be added to the bot")
        .addStringOption((option) => {
            return option
                .setName("title")
                .setDescription("The title of your suggestion")
                .setRequired(true)
        })
        .addStringOption((option) => {
            return option
                .setName("description")
                .setDescription("Describe the main features of your suggestion")
                .setRequired(true)
        }),
    execute
}