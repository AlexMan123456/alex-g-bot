const { Command } = require("@sapphire/framework");
const { MessageFlags } = require("discord.js");

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
            await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
        }
    }
}

module.exports = {GitHubCommand}