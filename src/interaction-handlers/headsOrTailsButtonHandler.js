const { EmbedBuilder } = require("discord.js");
const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const getRandomNumber = require("../utils/get-random-number");
const makeFirstLetterUppercase = require("../utils/make-first-letter-uppercase");
const { getUserById } = require("../database-interactions/users");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../database-interactions/users-and-guilds");
const { getGuildById } = require("../database-interactions/guilds");

class HeadsOrTailsHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        if(interaction.customId.includes("heads-button") || interaction.customId.includes("tails-button")){
            return this.some();
        }
        return this.none();
    }

    async run(interaction){
        const userChallenging = interaction.message.interaction.user;
        const userBeingChallenged = await this.container.client.users.fetch(interaction.customId.split("-")[5]);
        const userWhoChoseFirst = interaction.user

        if(userWhoChoseFirst.id !== userChallenging.id && userWhoChoseFirst.id !== userBeingChallenged.id){
            return await interaction.reply({content: `Stay out of this! This is a game between ${userChallenging.globalName} and ${userBeingChallenged.globalName}.`, ephemeral: true})
        }

        const userWhoChoseSecond = userWhoChoseFirst.id === userChallenging.id ? userBeingChallenged : userChallenging;
        const {result, winner} = this.#getWinner(interaction, userWhoChoseFirst, userWhoChoseSecond);
        const loser = winner.id === userWhoChoseFirst.id ? userWhoChoseSecond : userWhoChoseFirst

        // Pay winning user
        const {money_current: winnerPreviousCurrent} = await getUserAndGuildRelation(winner.id, interaction.guild.id);
        const {money_current: loserPreviousCurrent} = await getUserAndGuildRelation(loser.id, interaction.guild.id);

        const amountToPay = getRandomNumber(0,100);

        const winnerNewCurrent = winnerPreviousCurrent + amountToPay;
        const loserNewCurrent = loserPreviousCurrent - amountToPay;

        await patchUserAndGuildRelation(winner.id, interaction.guild.id, {money_current: winnerNewCurrent});
        await patchUserAndGuildRelation(loser.id, interaction.guild.id, {money_current: loserNewCurrent});
        //

        const {currency_symbol} = await getGuildById(interaction.guild.id)

        const embed = new EmbedBuilder()
        .setTitle(`${makeFirstLetterUppercase(result)}! ${winner.globalName} wins!`)
        .addFields(
            {name: `${winner.globalName}: Current`, value: `${currency_symbol}${winnerPreviousCurrent} → ${currency_symbol}${winnerNewCurrent}`},
            {name: `${loser.globalName}: Current`, value: `${currency_symbol}${loserPreviousCurrent} → ${currency_symbol}${loserNewCurrent}`}
            )
        .setColor("Green")

        await interaction.message.edit({content: "Game complete! See results below.", embeds: [], components: []})
        await interaction.reply({embeds: [embed]})
    }

    #getWinner(interaction, userWhoChoseFirst, userWhoChoseSecond){
        const result = ["heads", "tails"][getRandomNumber(0,1)];
        if((interaction.customId.includes("heads-button") && result === "heads") || (interaction.customId.includes("tails-button") && result === "tails")){
            return {result, winner: userWhoChoseFirst};
        }
        return {result, winner: userWhoChoseSecond}
    }
}

module.exports = {HeadsOrTailsHandler}