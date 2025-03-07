const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const formatDateAndTime = require("../utils/format-date-and-time");
const { patchSuggestion } = require("../database-interactions/suggestions");
const { ButtonBuilder, EmbedBuilder, ActionRowBuilder } = require("@discordjs/builders");
const { ButtonStyle, ButtonInteraction } = require("discord.js");
const logError = require("../utils/log-error");
const DMUser = require("../utils/dm-user");

class SuggestionsReopenButtonHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
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
            const suggestion = await patchSuggestion(interaction.message.id, "pending")
    
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
            
            const DMEmbed = new EmbedBuilder()
            .setTitle("Suggestion re-opened")
            .setAuthor({name: suggestion.author.global_name})
            .addFields({name: suggestion.title, value: suggestion.description})
            .setFooter({text: `Re-opened on ${date}, ${time}`})
    
            const user = await interaction.client.users.fetch(suggestion.author.user_id)
            const {DMSent} = await DMUser(user, {embeds: [DMEmbed]})
            if(DMSent === false){
                await interaction.user.send({content: "Could not DM user", embeds: [DMEmbed]})
            }
            await interaction.update({embeds: [embed], components: [buttons]})
        } catch(err) {
            await interaction.reply({content: "Could not re-open suggestion.", ephemeral: true})
            await logError(interaction, err)
        }

    }
}

module.exports = {SuggestionsReopenButtonHandler}