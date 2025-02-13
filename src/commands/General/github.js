const axios = require("axios")
const {execSync} = require("node:child_process")
const logError = require("../../utils/log-error")
const { Subcommand } = require("@sapphire/plugin-subcommands")
const { EmbedBuilder } = require("discord.js")
const formatDateAndTime = require("../../utils/format-date-and-time")
const turnNestedArrayIntoObject = require("../../utils/turn-nested-array-into-object")

class GitHubCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "link",
                    chatInputRun: "chatInputLink"
                },
                {
                    name: "commits",
                    chatInputRun: "chatInputCommits"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("github")
            .setDescription("View information about the bot's GitHub repository")
            .addSubcommand((command) => {
                return command
                .setName("link")
                .setDescription("Get the link to the bot's GitHub repository")
            })
            .addSubcommand((command) => {
                return command
                .setName("commits")
                .setDescription("View the bot's commit history")
            })
        })
    }

    async chatInputLink(interaction){
        try {
            await interaction.reply("Here is the link to the GitHub repository for my code: https://github.com/AlexMan123456/alex-g-bot")
        } catch(err) {
            await interaction.reply({content: "Error getting GitHub repository. Please try again later.", ephemeral: true})
            await logError(interaction, err)
        }
    }

    async chatInputCommits(interaction){
        const commits = execSync(`git log --pretty=format:"**%h**: %s" -10`).toString()

        const embed = new EmbedBuilder()
        .setTitle("Commit history")
        .setAuthor({name: interaction.user.globalName})
        .setDescription(commits)
        .setColor("Green")

        await interaction.reply({embeds: [embed]})
    }
}

module.exports = {GitHubCommand}