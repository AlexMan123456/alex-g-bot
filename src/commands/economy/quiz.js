const { Command } = require("@sapphire/framework")
const axios = require("axios")
const randomiseArray = require("../../utils/randomise-array")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const he = require("he")
const logError = require("../../utils/log-error")

class QuizCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            cooldownDelay: 10000
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("quiz")
            .setDescription("Answer a random trivia question to earn some money")
            .addStringOption((option) => {
                return option
                .setName("difficulty")
                .setDescription("Choose a difficulty level (easy, medium, hard)")
            })
        })
    }

    async chatInputRun(interaction){
        try {
            const chosenDifficulty = this.getDifficulty(interaction)
            let apiLink = "https://opentdb.com/api.php?amount=1"

            if(chosenDifficulty){
                apiLink = apiLink + `&difficulty=${chosenDifficulty}`
            }

            const {data} = await axios.get(apiLink)
            const quizQuestion = data.results[0]
            const allAnswers = this.setupAnswers(quizQuestion.incorrect_answers, quizQuestion.correct_answer)
            console.log(quizQuestion.correct_answer)

            const optionChoices = ["A", "B", "C", "D"]
    
            const embed = new EmbedBuilder()
            .setTitle(he.decode(quizQuestion.question))
            .setAuthor({name: interaction.user.globalName})
            .setFooter({text: `Difficulty: ${quizQuestion.difficulty}`})
            .addFields(
                ...optionChoices.map((optionChoice, index) => {
                    return {name: optionChoice, value: he.decode(allAnswers[index])}
                })
            )
            .setColor(this.getEmbedColour(quizQuestion.difficulty))
    
            const buttons = new ActionRowBuilder().addComponents(
                ...optionChoices.map((optionChoice, index) => {
                    return new ButtonBuilder()
                    .setCustomId(`quiz-option-${optionChoice + (allAnswers[index] === quizQuestion.correct_answer ? "-correct" : "")}`)
                    .setLabel(optionChoice)
                    .setStyle(ButtonStyle.Primary)
                })
            )
            
            await interaction.reply({embeds: [embed], components: [buttons]})
        } catch(err) {
            await interaction.reply({content: "Error getting quiz question. Please try again later.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    setupAnswers(incorrectAnswers, correctAnswer){
        const allAnswers = [...incorrectAnswers]
        allAnswers.push(correctAnswer)
        return randomiseArray(allAnswers)
    }

    getDifficulty(interaction){
        const chosenOption = interaction.options.getString("difficulty") ?? ""
        const validDifficulties = ["easy", "medium", "hard"]
        if(validDifficulties.includes(chosenOption.toLowerCase())){
            return chosenOption.toLowerCase()
        }
        return ""
    }

    getEmbedColour(difficulty){
        if(difficulty === "easy"){
            return "Blue"
        }
        if(difficulty === "medium"){
            return "Orange"
        }
        return "DarkRed"
    }
}

module.exports = {QuizCommand}