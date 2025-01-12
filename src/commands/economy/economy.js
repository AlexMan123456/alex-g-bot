const { Subcommand } = require("@sapphire/plugin-subcommands");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../../database-interactions/usersAndGuilds");
const { EmbedBuilder } = require("discord.js");
const logError = require("../../utils/log-error");

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
                    cooldownDelay: 10000
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

            const embed = new EmbedBuilder()
                .setTitle("Money deposited")
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${previousCurrent} → ${newCurrent}`},
                    {name: "Savings", value: `${previousSavings} → ${newSavings}`}
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

            const embed = new EmbedBuilder()
                .setTitle("Money withdrawn")
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${previousCurrent} → ${newCurrent}`},
                    {name: "Savings", value: `${previousSavings} → ${newSavings}`}
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
            
            const embed = new EmbedBuilder()
                .setTitle("Balance")
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${money_current}`},
                    {name: "Savings", value: `${money_savings}`}
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

            const newCurrent = previousCurrent + 100

            await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent})

            const embed = new EmbedBuilder()
                .setTitle("Daily bonus claimed")
                .setAuthor({name: interaction.user.globalName})
                .setColor("Green")
                .addFields(
                    {name: "Current", value: `${previousCurrent} → ${newCurrent}`}
                )
            
                await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Could not claim daily bonus.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {EconCommand}