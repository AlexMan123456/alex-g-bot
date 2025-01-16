const { Command } = require("@sapphire/framework")
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../../database-interactions/users-and-guilds")
const getRandomNumber = require("../../utils/get-random-number")
const { EmbedBuilder } = require("discord.js")
const { getGuildById } = require("../../database-interactions/guilds")
const logError = require("../../utils/log-error")
const { postCommandCooldown } = require("../../database-interactions/command-cooldowns")
const formatDateAndTime = require("../../utils/format-date-and-time")

class StealMoneyCommand extends Command {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: ["CommandCooldown"]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("steal-money")
            .setDescription("Steal money from another user")
            .addUserOption((option) => {
                return option
                .setName("user")
                .setDescription("The user to steal money from")
                .setRequired(true)
            })
        })
    }

    async chatInputRun(interaction){
        try {
            const userToStealFrom = interaction.options.getUser("user")
            const {money_current: oldCurrentOfUserStealing} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const {money_current: oldCurrentOfUserToStealFrom} = await getUserAndGuildRelation(userToStealFrom.id, interaction.guild.id)
    
            if(oldCurrentOfUserToStealFrom === 0){
                return await interaction.reply(`${userToStealFrom.globalName} has no money in current to steal!`)
            }

            const chance = getRandomNumber(1,100)

            if(chance > 50){
                const {cooldown_expiry} = await postCommandCooldown("steal-money", interaction.user.id, interaction.guild.id, new Date(new Date().getTime() + 3600000))
                const {date: expiryDate, time: expiryTime} = formatDateAndTime(cooldown_expiry.toISOString())
                return await interaction.reply(`You've been caught, thief! You're under arrest until ${expiryDate}, ${expiryTime}. Your sentence ends <t:${new Date(cooldown_expiry.getTime()/1000).getTime()}:R>.`)
            }
    
            const amountToSteal = getRandomNumber(1,100)
            const newCurrentOfUserStealing = oldCurrentOfUserStealing + amountToSteal
            const newCurrentOfUserToStealFrom = oldCurrentOfUserToStealFrom - amountToSteal
    
            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrentOfUserStealing})
            await patchUserAndGuildRelation(userToStealFrom.id, interaction.guild.id, {money_current: newCurrentOfUserToStealFrom})
    
            const {currency_symbol} = await getGuildById(interaction.guild.id)
            const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.globalName} stole ${currency_symbol}${amountToSteal} from ${userToStealFrom.globalName}`)
            .setAuthor({name: interaction.user.globalName})
            .addFields(
                {name: `${interaction.user.globalName}: Current`, value: `${currency_symbol}${oldCurrentOfUserStealing} → ${currency_symbol}${newCurrentOfUserStealing}`},
                {name: `${userToStealFrom.globalName}: Current`, value: `${currency_symbol}${oldCurrentOfUserToStealFrom} → ${currency_symbol}${newCurrentOfUserToStealFrom}`},
            )
    
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Error stealing money.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {StealMoneyCommand}