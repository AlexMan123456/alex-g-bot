const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

class AcceptHeadsOrTailsHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        if(interaction.customId.includes("heads-or-tails-challenge-accept") || interaction.customId.includes("heads-or-tails-challenge-deny")){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        const userChallenging = interaction.message.interaction.user;
        const userBeingChallenged = await this.container.client.users.fetch(interaction.customId.split("-")[8]);

        if(interaction.customId.includes("heads-or-tails-challenge-deny")){
            return await interaction.message.edit({content: `${userBeingChallenged.globalName} has cowered out of the challenge! Shame!`, embeds: [], components: []});
        }

        const embed = new EmbedBuilder()
        .setTitle(`${userChallenging.globalName} vs ${userBeingChallenged.globalName}`)
        .setDescription("Pick a side: Heads or tails?")
        .setColor("Green")

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`heads-button-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Heads")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`tails-button-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Tails")
                .setStyle(ButtonStyle.Primary)
        )

        await interaction.message.edit({content: "", embeds: [embed], components: [buttons]});
        await interaction.reply({content: "This needs to be here because all interactions need to be replied to, and not having this will cause the interaction to fail. Please ignore this.", ephemeral: true});
    }
}

module.exports = {AcceptHeadsOrTailsHandler}