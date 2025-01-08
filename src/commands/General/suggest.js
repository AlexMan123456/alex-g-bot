const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js")
const findChannel = require("../../utils/find-channel")
const { getUserById, postUser } = require("../../database-interactions/users")
const { postSuggestion } = require("../../database-interactions/suggestions")
const logError = require("../../utils/log-error")
const { Subcommand } = require("@sapphire/plugin-subcommands")
const { stripIndents } = require("common-tags")

class SuggestCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "create",
                    chatInputRun: "chatInputCreate"
                },
                {
                    name: "view",
                    chatInputRun: "chatInputView"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("suggestions")
                .setDescription("Manage your suggestions to the bot")
                .addSubcommand((command) => {
                    return command
                        .setName("create")
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
                .addSubcommand((command) => {
                    return command
                        .setName("view")
                        .setDescription("View all your suggestions to the bot")
                })
        })
    }

    async chatInputCreate(interaction){
        const suggestionTitle = interaction.options.getString("title")
        const suggestionDescription = interaction.options.getString("description")
        
        try {
            const suggestionsChannel = await findChannel(interaction, "suggestions").then((channelDetails) => {
                return interaction.guild.channels.cache.get(channelDetails[0])
            })
            const message = await suggestionsChannel.send({content: "Logging suggestion..."})
            const suggestion = await addSuggestionToDatabase({suggestion_id: message.id, title: suggestionTitle, description: suggestionDescription}, interaction.user)

            const resolveButton = new ButtonBuilder()
                .setCustomId("suggestion-resolve")
                .setLabel("Resolve")
                .setStyle(ButtonStyle.Success)

            const rejectButton = new ButtonBuilder()
                .setCustomId("suggestion-reject")
                .setLabel("Reject")
                .setStyle(ButtonStyle.Danger)

            const embed = new EmbedBuilder()
                .setTitle(suggestion.title)
                .setAuthor({name: suggestion.author.global_name})
                .addFields({name: "Details", value: suggestion.description})
                .setTimestamp()
            
            const buttons = new ActionRowBuilder().addComponents(resolveButton, rejectButton)
      
            await message.edit({content: "", embeds: [embed], components: [buttons]})
            await interaction.reply({embeds: [embed], ephemeral: true})
        } catch(err) {
            await interaction.reply({content: "Could not log suggestion. Please try again later.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputView(interaction){
        const {suggestions} = await getUserById(interaction.user.id)
        console.log(suggestions)

        const embed = new EmbedBuilder()
            .setTitle("All suggestions")
            .setAuthor({name: interaction.user.globalName})
            .addFields(
                ...suggestions.map((suggestion) => {
                    return {name: suggestion.title, value: stripIndents(
                        `${suggestion.description}
                        *Status: ${suggestion.status}*`
                    )}
                })
            )
        
        await interaction.reply({embeds: [embed]})
    }
}

async function addSuggestionToDatabase(suggestion, user){
    const author = await getUserById(user.id)
    if(!author){
        await postUser(user)
    }
    return await postSuggestion(suggestion, user.id)
}


module.exports = {SuggestCommand}