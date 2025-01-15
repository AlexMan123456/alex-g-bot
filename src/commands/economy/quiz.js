const { Command } = require("@sapphire/framework")
const axios = require("axios")
const randomiseArray = require("../../utils/randomise-array")
const { EmbedBuilder } = require("discord.js")
const he = require("he")

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
        })
    }

    async chatInputRun(interaction){
        const {data} = await axios.get("https://opentdb.com/api.php?amount=1")
        const quizQuestion = data.results[0]
        const allAnswers = this.setupAnswers(quizQuestion.incorrect_answers, quizQuestion.correct_answer)

        const embed = new EmbedBuilder()
        .setTitle(he.decode(quizQuestion.question))
        .setAuthor({name: interaction.user.globalName})
        .setFooter({text: `Difficulty: ${quizQuestion.difficulty}`})
        .addFields(
            ...["A", "B", "C", "D"].map((optionChoice, index) => {
                return {name: optionChoice, value: he.decode(allAnswers[index])}
            })
        )
        
        await interaction.reply({embeds: [embed]})
    }

    setupAnswers(incorrectAnswers, correctAnswer){
        const allAnswers = [...incorrectAnswers]
        allAnswers.push(correctAnswer)
        return randomiseArray(allAnswers)
    }
}

module.exports = {QuizCommand}