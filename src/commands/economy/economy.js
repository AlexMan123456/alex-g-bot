const { Subcommand } = require("@sapphire/plugin-subcommands");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../../database-interactions/users-and-guilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");
const getRandomNumber = require("../../utils/get-random-number");
const { patchGuild, getGuildById } = require("../../database-interactions/guilds");
const { postCommandCooldown } = require("../../database-interactions/command-cooldowns");
const formatDateAndTime = require("../../utils/format-date-and-time");

class EconCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "deposit",
                    chatInputRun: "chatInputDeposit"
                },
                {
                    name: "withdraw",
                    chatInputRun: "chatInputWithdraw"
                },
                {
                    name: "balance",
                    chatInputRun: "chatInputBalance"
                },
                {
                    name: "daily-bonus",
                    chatInputRun: "chatInputDailyBonus",
                    preconditions: ["CommandCooldown"]
                },
                {
                    name: "set-currency-symbol",
                    chatInputRun: "chatInputSetCurrency",
                    preconditions: ["OwnerOnly"]
                },
                {
                    name: "steal",
                    chatInputRun: "chatInputSteal",
                    preconditions: ["CommandCooldown"]
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("economy")
            .setDescription("Economy commands")
            .addSubcommand((command) => {
                return command
                .setName("deposit")
                .setDescription("Transfer money from current to savings")
                .addNumberOption((option) => {
                    return option
                    .setName("money")
                    .setDescription("Amount of money to deposit (leave blank to deposit all)")
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("withdraw")
                .setDescription("Transfer money from savings to current")
                .addNumberOption((option) => {
                    return option
                    .setName("money")
                    .setDescription("Amount of money to withdraw (leave blank to withdraw all)")
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("balance")
                .setDescription("See your current balance")
            })
            .addSubcommand((command) => {
                return command
                .setName("daily-bonus")
                .setDescription("Claim your daily bonus")
            })
            .addSubcommand((command) => {
                return command
                .setName("set-currency-symbol")
                .setDescription("Set the currency symbol")
                .addStringOption((option) => {
                    return option
                    .setName("symbol")
                    .setDescription("The symbol to set as currency symbol")
                    .setRequired(true)
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("steal")
                .setDescription("Steal money from another user")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to steal money from")
                    .setRequired(true)
                })
            })
        })
    }

    async chatInputDeposit(interaction){
        try {
            const {money_current: previousCurrent, money_savings: previousSavings} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const depositAmount = interaction.options.getNumber("money") ?? previousCurrent

            const newCurrent = previousCurrent - depositAmount
            const newSavings = previousSavings + depositAmount

            if(newCurrent < 0 || newSavings < 0){
                return await interaction.reply("Cannot deposit more money than you currently have.")
            }

            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent, money_savings: newSavings})
            const {currency_symbol} = await getGuildById(interaction.guild.id)

            const embed = new EmbedBuilder()
                .setTitle(`Deposited ${depositAmount}`)
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${currency_symbol}${previousCurrent} → ${currency_symbol}${newCurrent}`},
                    {name: "Savings", value: `${currency_symbol}${previousSavings} → ${currency_symbol}${newSavings}`}
                )
            
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Error depositing money.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputWithdraw(interaction){
        try {
            const {money_current: previousCurrent, money_savings: previousSavings} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const withdrawAmount = interaction.options.getNumber("money") ?? previousSavings

            const newCurrent = previousCurrent + withdrawAmount
            const newSavings = previousSavings - withdrawAmount

            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent, money_savings: newSavings})
            const {currency_symbol} = await getGuildById(interaction.guild.id)

            const embed = new EmbedBuilder()
                .setTitle(`Withdrawn ${withdrawAmount}`)
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${currency_symbol}${previousCurrent} → ${currency_symbol}${newCurrent}`},
                    {name: "Savings", value: `${currency_symbol}${previousSavings} → ${currency_symbol}${newSavings}`}
                )
            
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Error withdrawing money.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputBalance(interaction){
        try {
            const {money_current, money_savings} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const {currency_symbol} = await getGuildById(interaction.guild.id)
            
            const embed = new EmbedBuilder()
                .setTitle("Balance")
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${currency_symbol}${money_current}`},
                    {name: "Savings", value: `${currency_symbol}${money_savings}`}
                )
            
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Could not load balance. Please try again later", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputDailyBonus(interaction){
        try {
            const {money_current: previousCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const increment = getRandomNumber(1,100)

            const newCurrent = previousCurrent + increment

            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent})
            const {currency_symbol} = await getGuildById(interaction.guild.id)

            const embed = new EmbedBuilder()
                .setTitle(`Daily bonus claimed: +${increment}`)
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${currency_symbol}${previousCurrent} → ${currency_symbol}${newCurrent}`}
                )
            
                await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Could not claim daily bonus.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputSetCurrency(interaction){
        try {
            const currency_symbol = interaction.options.getString("symbol")
            if(currency_symbol.length !== 1){
                return await interaction.reply({content: "Currency symbol must be a single character"})
            }
            
            await patchGuild(interaction.guild.id, {currency_symbol})
            await interaction.reply(`Currency symbol set to ${currency_symbol}.`)
        } catch(err) {
            await interaction.reply({content: "Could not set currency symbol. Please try again later."})
            await logError(interaction, err)
        }
    }

    async chatInputSteal(interaction){
        try {
            const userToStealFrom = interaction.options.getUser("user")
            const {money_current: oldCurrentOfUserStealing} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const {money_current: oldCurrentOfUserToStealFrom} = await getUserAndGuildRelation(userToStealFrom.id, interaction.guild.id)
    
            if(oldCurrentOfUserToStealFrom === 0){
                return await interaction.reply(`${userToStealFrom.globalName} has no money in current to steal!`)
            }

            const chance = getRandomNumber(1,100)

            if(chance > 50){
                const {cooldown_expiry} = await postCommandCooldown("economy steal", interaction.user.id, interaction.guild.id, new Date(new Date().getTime() + 3600000))
                const {date: expiryDate, time: expiryTime} = formatDateAndTime(cooldown_expiry.toISOString())

                const embedCaught = new EmbedBuilder()
                .setTitle("You've been caught, thief!")
                .setAuthor({name: interaction.user.globalName})
                .setDescription(`You've been caught trying to steal from ${userToStealFrom.globalName}. You're under arrest until ${expiryDate}, ${expiryTime}. Your sentence ends <t:${new Date(cooldown_expiry.getTime()/1000).getTime()}:R>.`)
                .setColor("Red")

                return await interaction.reply({embeds: [embedCaught]})
            }
    
            const amountToSteal = getStealAmount(1, 100, oldCurrentOfUserToStealFrom)
            const newCurrentOfUserStealing = oldCurrentOfUserStealing + amountToSteal
            const newCurrentOfUserToStealFrom = oldCurrentOfUserToStealFrom - amountToSteal
    
            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrentOfUserStealing})
            await patchUserAndGuildRelation(userToStealFrom.id, interaction.guild.id, {money_current: newCurrentOfUserToStealFrom})
    
            const {currency_symbol} = await getGuildById(interaction.guild.id)
            const embedSuccess = new EmbedBuilder()
            .setTitle(`${interaction.user.globalName} stole ${currency_symbol}${amountToSteal} from ${userToStealFrom.globalName}`)
            .setAuthor({name: interaction.user.globalName})
            .addFields(
                {name: `${interaction.user.globalName}: Current`, value: `${currency_symbol}${oldCurrentOfUserStealing} → ${currency_symbol}${newCurrentOfUserStealing}`},
                {name: `${userToStealFrom.globalName}: Current`, value: `${currency_symbol}${oldCurrentOfUserToStealFrom} → ${currency_symbol}${newCurrentOfUserToStealFrom}`},
            )
            .setColor("Green")
    
            await interaction.reply({embeds: [embedSuccess]})
        } catch(err) {
            await interaction.reply({content: "Error stealing money.", ephemeral: true})
            await logError(interaction, err)
        }

        function getStealAmount(lowerBound, upperBound, amountInCurrent){
            let amountToSteal = getRandomNumber(lowerBound, upperBound)
            if(amountToSteal > amountInCurrent){
                return amountInCurrent
            }
            return amountToSteal
        }
    }
}

module.exports = {EconCommand}