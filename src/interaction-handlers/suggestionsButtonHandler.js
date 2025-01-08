const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const formatDateAndTime = require("../utils/format-date-and-time");
const { EmbedBuilder } = require("discord.js");
const { getSuggestion, patchSuggestion } = require("../database-interactions/suggestions");

class SuggestionsButtonHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        if(interaction.customId === "resolve" || interaction.customId === "reject"){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        const {date, time} = formatDateAndTime(new Date().toISOString())
        const suggestion = await patchSuggestion(interaction.message.id, interaction.customId === "resolve" ? true : false)
        const embed = new EmbedBuilder()
            .setTitle(suggestion.title)
            .setAuthor({name: suggestion.author.global_name})
            .addFields({name: "Details", value: suggestion.description})
            .setFooter({text: `${interaction.customId === "resolve" ? "Resolved" : "Rejected"} on ${date}, ${time}`})
            .setColor(interaction.customId === "resolve" ? "Green" : "Red")

        await interaction.message.edit({embeds: [embed]})
    }
}

module.exports = {SuggestionsButtonHandler}