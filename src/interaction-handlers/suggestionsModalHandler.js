const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { ButtonStyle, ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const logError = require("../utils/log-error");
const { getGuildById } = require("../database-interactions/guilds");
const { postSuggestion } = require("../database-interactions/suggestions");

class SuggestionHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        })
    }

    parse(interaction){
        if(interaction.customId === "createSuggestion"){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        const suggestionTitle = interaction.fields.getTextInputValue("suggestionTitle")
        const suggestionDescription = interaction.fields.getTextInputValue("suggestionDescription")
        
        try {
            const suggestionsChannel = await getGuildById(interaction.guild.id).then((guild) => {
                return interaction.guild.channels.cache.get(guild.suggestions_channel_id)
            })
            const message = await suggestionsChannel.send({content: "Logging suggestion..."})
            const suggestion = await postSuggestion({suggestion_id: message.id, title: suggestionTitle, description: suggestionDescription}, interaction.user.id)

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
}

module.exports = {SuggestionHandler}