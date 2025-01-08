const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const formatDateAndTime = require("../utils/format-date-and-time");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { patchSuggestion } = require("../database-interactions/suggestions");
const logError = require("../utils/log-error");

class SuggestionsResolveRejectButtonHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        if(interaction.customId === "suggestion-resolve" || interaction.customId === "suggestion-reject"){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        if(interaction.user.id !== process.env.OWNER_ID){
            return await interaction.reply({content: "Only the owner can resolve/reject suggestions.", ephemeral: true})
        }

        try {
            const {date, time} = formatDateAndTime(new Date().toISOString())
            const suggestion = await patchSuggestion(interaction.message.id, interaction.customId === "suggestion-resolve" ? true : false)
    
            const pendingButton = new ButtonBuilder()
                .setCustomId("suggestion-pending")
                .setLabel("Re-open")
                .setStyle(ButtonStyle.Primary)
            
            const buttons = new ActionRowBuilder().addComponents(pendingButton)
    
            const embed = new EmbedBuilder()
                .setTitle(suggestion.title)
                .setAuthor({name: suggestion.author.global_name})
                .addFields({name: "Details", value: suggestion.description})
                .setFooter({text: `${interaction.customId === "suggestion-resolve" ? "Resolved" : "Rejected"} on ${date}, ${time}`})
                .setColor(interaction.customId === "suggestion-resolve" ? "Green" : "Red")
    
            await interaction.message.edit({embeds: [embed], components: [buttons]})
        } catch(err) {
            await interaction.reply({content: `Could not ${interaction.customId === "suggestion-resolve" ? "resolve" : "reject"} suggestion.`, ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {SuggestionsResolveRejectButtonHandler}