const { Command, container } = require("@sapphire/framework")
const { EmbedBuilder, MessageFlags } = require("discord.js")
const findChannel = require("../../utils/find-channel")
const { getUserById, postUser } = require("../../database-interactions/users")
const { postSuggestion } = require("../../database-interactions/suggestions")

class SuggestCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
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
                })
        })
    }

    async chatInputRun(interaction){
        const suggestionTitle = interaction.options.getString("title")
        const suggestionDescription = interaction.options.getString("description")

        try {
            await addSuggestionToDatabase({title: suggestionTitle, description: suggestionDescription}, interaction.user)
        } catch(err) {
            return await interaction.reply({content: `${err}`, ephemeral: true})
        }

        const embed = new EmbedBuilder()
            .setTitle(suggestionTitle)
            .setAuthor({name: interaction.user.globalName})
            .addFields({name: "Details", value: suggestionDescription})
            .setTimestamp()

        try {
            const suggestionsChannel = await findSuggestionsChannel(interaction)
            await interaction.guild.channels.cache.get(suggestionsChannel[0]).send({embeds: [embed]})
            await interaction.reply({embeds: [embed], ephemeral: true})
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }
}

function findSuggestionsChannel(interaction){
    return interaction.guild.channels.fetch().then((data) => {
        return findChannel([...data], "suggestions")
    })
}

async function addSuggestionToDatabase(suggestion, user){
    const author = await getUserById(user.id)
    if(!author){
        await postUser(user)
    }
    await postSuggestion(suggestion, user.id)
}


module.exports = {SuggestCommand}