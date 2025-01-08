const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const formatDateAndTime = require("../utils/format-date-and-time");
const { patchSuggestion } = require("../database-interactions/suggestions");
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle, ButtonInteraction } = require("discord.js");
const logError = require("../utils/log-error");

class SuggestionsReopenButtonHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: ["OwnerOnly"],
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        if(interaction.customId === "suggestion-reopen"){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        if(interaction.user.id !== process.env.OWNER_ID){
            return await interaction.reply({content: "Only the owner can re-open suggestions.", ephemeral: true})
        }

        try {
            const {date, time} = formatDateAndTime(new Date().toISOString())
            const suggestion = await patchSuggestion(interaction.message.id, "Pending")
    
            const resolveButton = new ButtonBuilder()
                    .setCustomId("suggestion-resolve")
                    .setLabel("Resolve")
                    .setStyle(ButtonStyle.Success)
    
            const rejectButton = new ButtonBuilder()
                .setCustomId("suggestion-reject")
                .setLabel("Reject")
                .setStyle(ButtonStyle.Danger)
            
            const buttons = new ActionRowBuilder().addComponents(resolveButton, rejectButton)
    
            const embed = new EmbedBuilder()
                .setTitle(suggestion.title)
                .setAuthor({name: suggestion.author.global_name})
                .addFields({name: "Details", value: suggestion.description})
                .setFooter({text: `Re-opened on ${date}, ${time}`})
    
            await interaction.update({embeds: [embed], components: [buttons]})
        } catch(err) {
            await interaction.reply({content: "Could not re-open suggestion.", ephemeral: true})
            await logError(interaction, err)
        }

    }
}

module.exports = {SuggestionsPendingButtonHandler: SuggestionsReopenButtonHandler}