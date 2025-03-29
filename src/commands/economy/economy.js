const { Subcommand } = require("@sapphire/plugin-subcommands");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../../database-interactions/users-and-guilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");
const getRandomNumber = require("../../utils/get-random-number");
const { patchGuild, getGuildById } = require("../../database-interactions/guilds");
const { postCommandCooldown } = require("../../database-interactions/command-cooldowns");
const formatDateAndTime = require("../../utils/format-date-and-time");
const { getUserById } = require("../../database-interactions/users");
const { stripIndents } = require("common-tags");
const getMonthByNumber = require("../../utils/get-month-by-number");

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
                    chatInputRun: "chatInputBalance",
                    default: true
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
                },
                {
                    name: "pay-user",
                    chatInputRun: "chatInputPay"
                },
                {
                    name: "birthday-bonus",
                    chatInputRun: "chatInputBirthdayBonus"
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
                .setDescription("See a user's current balance")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to get the balance of (leave blank to see your own)")
                })
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
            .addSubcommand((command) => {
                return command
                .setName("pay-user")
                .setDescription("Pay another user")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to pay")
                    .setRequired(true)
                })
                .addNumberOption((option) => {
                    return option
                    .setName("amount")
                    .setDescription("The amount to pay the given user")
                    .setRequired(true)
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("birthday-bonus")
                .setDescription("Claim your bonus if it's your birthday")
            })
        })
    }

    async chatInputDeposit(interaction){
        try {
            const {money_current: previousCurrent, money_savings: previousSavings} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const depositAmount = interaction.options.getNumber("money") ?? previousCurrent
            
            if(depositAmount > previousCurrent){
                return await interaction.reply("Cannot deposit more money than you currently have.")
            }

            const newCurrent = previousCurrent - depositAmount
            const newSavings = previousSavings + depositAmount


            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent, money_savings: newSavings})
            const {currency_symbol} = await getGuildById(interaction.guild.id)

            const embed = new EmbedBuilder()
                .setTitle(`Deposited ${currency_symbol}${depositAmount}`)
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

            if(withdrawAmount > previousSavings){
                return await interaction.reply({content: "Can't withdraw more money than you currently have."})
            }

            const newCurrent = previousCurrent + withdrawAmount
            const newSavings = previousSavings - withdrawAmount

            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent, money_savings: newSavings})
            const {currency_symbol} = await getGuildById(interaction.guild.id)

            const embed = new EmbedBuilder()
                .setTitle(`Withdrawn ${currency_symbol}${withdrawAmount}`)
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
            const user = interaction.options.getUser("user") ?? interaction.user

            const {money_current, money_savings} = await getUserAndGuildRelation(user.id, interaction.guild.id)
            const {currency_symbol} = await getGuildById(interaction.guild.id)
            
            const embed = new EmbedBuilder()
                .setTitle("Balance")
                .setAuthor({name: user.globalName})
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
                .setTitle(`Daily bonus claimed: +${currency_symbol}${increment}`)
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${currency_symbol}${previousCurrent} → ${currency_symbol}${newCurrent}`}
                )

                await postCommandCooldown("economy daily-bonus", interaction.user.id, interaction.guild.id, new Date(new Date().getTime() + 86400000))
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
                .addFields({name: `You've been caught trying to steal from ${userToStealFrom.globalName}`, value: `You're under arrest until ${expiryDate}, ${expiryTime}. Your sentence ends <t:${new Date(cooldown_expiry.getTime()/1000).getTime()}:R>.`})
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

    async chatInputPay(interaction){
        try {
            const userToPay = interaction.options.getUser("user")
            const amountToPay = interaction.options.getNumber("amount")
    
            const {money_current: oldUserPayingCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id)
            const {money_current: oldUserToPayCurrent} = await getUserAndGuildRelation(userToPay.id, interaction.guild.id)
    
            if(oldUserPayingCurrent === 0){
                return await interaction.reply({content: "You do not have any money to pay.", ephemeral: true})
            }
    
            const newUserPayingCurrent = oldUserPayingCurrent - amountToPay
            if(newUserPayingCurrent < 0){
                return await interaction.reply({content: "You do not have enough money to make this payment", ephemeral: true})
            }
            const newUserToPayCurrent = oldUserToPayCurrent + amountToPay
    
            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newUserPayingCurrent})
            await patchUserAndGuildRelation(userToPay.id, interaction.guild.id, {money_current: newUserToPayCurrent})
    
            const {currency_symbol} = await getGuildById(interaction.guild.id)
            const embed = new EmbedBuilder()
            .setTitle(`${interaction.user.globalName} has paid ${userToPay.globalName} ${currency_symbol}${amountToPay}`)
            .addFields(
                {name: `${interaction.user.globalName}: Current`, value: `${currency_symbol}${oldUserPayingCurrent} → ${currency_symbol}${newUserPayingCurrent}`},
                {name: `${userToPay.globalName}: Current`, value: `${currency_symbol}${oldUserToPayCurrent} → ${currency_symbol}${newUserToPayCurrent}`}
            )
            .setColor("Green")
    
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply("Error making payment. Please try again later.")
            await logError(interaction, err)
        }
    }

    async chatInputBirthdayBonus(interaction){
        try {
            const {date_of_birth} = await getUserById(interaction.user.id);

            if(!date_of_birth){
                return await interaction.reply({content: "No birthday set yet. Run `/add-birthday` to set your birthday.", ephemeral: true})
            }

            if(date_of_birth?.getDate() === new Date().getDate() && date_of_birth?.getMonth() === new Date().getMonth()){
                const {money_current: oldCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id);
                const increment = getRandomNumber(500,1000);
                const newCurrent = oldCurrent + increment;
                await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {
                    money_current: newCurrent
                })
                const {currency_symbol} = await getGuildById(interaction.guild.id)
                const embed = new EmbedBuilder()
                .setTitle(`Happy birthday, ${interaction.user.globalName}`)
                .setDescription(`Here's an extra ${currency_symbol}${increment} as a birthday present!`)
                .addFields(
                    {name: "Current", value: `${currency_symbol}${oldCurrent} → ${currency_symbol}${newCurrent}`}
                )
                .setColor("Green")

                return await interaction.reply({embeds: [embed]})
            }

            await interaction.reply(stripIndents(`Don't be so greedy, <@${interaction.user.id}>! It's not your birthday yet - wait your turn!
            Try again on ${getMonthByNumber(date_of_birth?.getMonth()+1)} ${date_of_birth?.getDate()}`))
        } catch(error) {
            await interaction.reply({content: "Error claiming birthday bonus. Please try again later.", ephemeral: true})
            await logError(interaction, error)
        }   
    }
}

module.exports = {EconCommand}