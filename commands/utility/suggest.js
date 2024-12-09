const { SlashCommandBuilder } = require("discord.js")

async function execute(interaction){
    const suggestionsChannel = await findSuggestionsChannel(interaction)
    await interaction.guild.channels.cache.get(suggestionsChannel[0]).send({content: suggestionsChannel[1].name})
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
        .setDescription("Suggest a feature to be added to the bot"),
    execute
}