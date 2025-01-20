const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const formatDateAndTime = require("../utils/format-date-and-time");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ButtonInteraction } = require("discord.js");
const { patchSuggestion } = require("../database-interactions/suggestions");
const logError = require("../utils/log-error");
const makeFirstLetterUppercase = require("../utils/make-first-letter-uppercase");
const DMUser = require("../utils/dm-user");

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

        const resolveOrReject = interaction.customId === "suggestion-resolve" ? "resolved" : "rejected"

        try {
            const {date, time} = formatDateAndTime(new Date().toISOString())
            const suggestion = await patchSuggestion(interaction.message.id, resolveOrReject)
    
            const pendingButton = new ButtonBuilder()
                .setCustomId("suggestion-reopen")
                .setLabel("Re-open")
                .setStyle(ButtonStyle.Primary)
            
            const buttons = new ActionRowBuilder().addComponents(pendingButton)
    
            const embed = new EmbedBuilder()
                .setTitle(`Suggestion ${suggestion.status}`)
                .setAuthor({name: suggestion.author.global_name})
                .addFields({name: suggestion.title, value: suggestion.description})
                .setFooter({text: `${makeFirstLetterUppercase(suggestion.status)} on ${date}, ${time}`})
                .setColor(suggestion.status === "resolved" ? "Green" : "Red")

            const user = await interaction.client.users.fetch(suggestion.author.user_id)
            const {DMSent} = await DMUser(user, {embeds: [embed]})
            await interaction.update({embeds: [embed], components: [buttons]})
            if(DMSent === false){
                await interaction.user.send({content: "Could not DM user", embeds: [embed]})
            }
        } catch(err) {
            await interaction.reply({content: `Could not ${resolveOrReject === "resolved" ? "resolve" : "reject"} suggestion.`, ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {SuggestionsResolveRejectButtonHandler}