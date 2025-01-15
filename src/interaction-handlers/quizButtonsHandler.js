const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const getRandomNumber = require("../utils/get-random-number");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../database-interactions/users-and-guilds");
const logError = require("../utils/log-error");

class QuizButtonsHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.Button
        })
    }

    parse(interaction){
        const IDParts = interaction.customId.split("-")
        if(IDParts.includes("quiz") && IDParts.includes("option")){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        const isChoiceCorrect = interaction.customId.split("-").includes("correct") ? true : false
        const question = interaction.message.embeds[0].data.title
        const chosenOption = this.getChosenOption(interaction)
        const correctOption = this.getCorrectOption(interaction)

        try {
            const embedFields = [{name: "Correct choice", value: `**${correctOption.name}**. ${correctOption.value}`}]
            if(!isChoiceCorrect){
                embedFields.push({name: "You chose", value: `**${chosenOption.name}**. ${chosenOption.value}`})
            } else {
                const amountEarned = this.getAmountEarned(interaction.message.embeds[0].footer.text.split(" ")[1])
                const {money_current: previousAmount} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
                const newAmount = previousAmount + amountEarned
                await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newAmount})
                embedFields.push({name: `You have earned ${amountEarned}`, value: `**Current**: ${previousAmount} → ${newAmount}`})
            }
            
            const embed = new EmbedBuilder()
            .setTitle(isChoiceCorrect ? "Question answered correctly!" : "Incorrect answer")
            .setAuthor({name: interaction.user.globalName})
            .setDescription(question)
            .addFields(...embedFields)
            .setColor(isChoiceCorrect ? "Green" : "Red")
            .setFooter({text: interaction.message.embeds[0].footer.text})
    
            await interaction.update({embeds: [embed], components: []})
        } catch(err) {
            await interaction.reply({content: "Could not parse your option choice. Please try again later.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    getChosenOption(interaction){
        return interaction.message.embeds[0].data.fields.find((option) => {
            return option.name === interaction.customId.split("-")[2]
        })
    }

    getCorrectOption(interaction){
        const {data: correctButton} = interaction.message.components[0].components.find((option) => {
            return option.customId.split("-").includes("correct")
        })
        return interaction.message.embeds[0].data.fields.find((option) => {
            return option.name === correctButton.label
        })
    }

    getAmountEarned(difficulty){
        if(difficulty === "easy"){
            return getRandomNumber(1, 200)
        } 
        if(difficulty === "medium"){
            return getRandomNumber(201, 400)
        } 
        return getRandomNumber(401, 600)
    
    }
}

module.exports = {QuizButtonsHandler}