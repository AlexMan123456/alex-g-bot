const { Command } = require("@sapphire/framework");
const { MessageFlags } = require("discord.js");
const logError = require("../../utils/log-error");

class GitHubCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder.setName("github").setDescription("Link to GitHub repo")
        })
    }

    async chatInputRun(interaction){
        try {
            await interaction.reply("Here is the link to the GitHub repository for my code: https://github.com/AlexMan123456/alex-g-bot")
        } catch(err) {
            await interaction.reply({content: "Error getting GitHub repository. Please try again later.", flags: MessageFlags.Ephemeral})
            await logError(interaction, err)
        }
    }
}

module.exports = {GitHubCommand}