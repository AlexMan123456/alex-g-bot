const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const getRandomNumber = require("../utils/get-random-number");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../database-interactions/users-and-guilds");
const logError = require("../utils/log-error");
const { getGuildById } = require("../database-interactions/guilds");

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
        const chosenOption = this.#getChosenOption(interaction)
        const correctOption = this.#getCorrectOption(interaction)
        const remainingOptions = this.#getRemainingOptions(interaction)

        try {
            const embedFields = [{name: "Correct answer", value: `**${correctOption.name}**. ${correctOption.value}`}]
            if(!isChoiceCorrect){
                embedFields.push({name: "You chose", value: `**${chosenOption.name}**. ${chosenOption.value}`})
            } else {
                // Figure out the amount earned based on difficulty
                const amountEarned = this.#getAmountEarned(interaction.message.embeds[0].footer.text.split(" ")[1])

                // Update the money in user's current account by the amount earned
                const {money_current: previousAmount} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
                const newAmount = previousAmount + amountEarned
                await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newAmount})

                // Get currency symbol
                const {currency_symbol} = await getGuildById(interaction.guild.id)

                // Add the amount earned to the embed
                embedFields.push({name: `You have earned ${currency_symbol}${amountEarned}`, value: `**Current**: ${currency_symbol}${previousAmount} → ${currency_symbol}${newAmount}`})
            }

            embedFields.push({name: "Remaining answer choices", value: remainingOptions.map((option) => {
                return `**${option.name}**. ${option.value}`
            }).join("\n")})
            
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

    #getChosenOption(interaction){
        return interaction.message.embeds[0].data.fields.find((option) => {
            return option.name === interaction.customId.split("-")[2]
        })
    }

    #getCorrectOption(interaction){
        const {data: correctButton} = interaction.message.components[0].components.find((option) => {
            return option.customId.split("-").includes("correct")
        })
        return interaction.message.embeds[0].data.fields.find((option) => {
            return option.name === correctButton.label
        })
    }

    #getRemainingOptions(interaction){
        const allOptions = [...interaction.message.embeds[0].data.fields]
        const correctOption = this.#getCorrectOption(interaction)
        const chosenOption = this.#getChosenOption(interaction)

        allOptions.splice(allOptions.indexOf(correctOption),1)
        if(chosenOption.name !== correctOption.name){
            allOptions.splice(allOptions.indexOf(chosenOption),1)
        }
        return allOptions
    }

    #getAmountEarned(difficulty){
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