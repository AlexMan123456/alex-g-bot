const { Command } = require("@sapphire/framework");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");

class HeadsOrTailsCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("heads-or-tails")
            .setDescription("Play a game of heads or tails with another user")
            .addUserOption((option) => {
                return option
                .setName("user")
                .setDescription("The name of the user you want to challenge")
                .setRequired(true)
            })
        })
    }

    async chatInputRun(interaction){
        const userBeingChallenged = interaction.options.getUser("user")

        if(userBeingChallenged.id === interaction.user.id){
            return await interaction.reply({content: "Are you really trying to play heads or tails by yourself? Try playing with a friend, if you have any!", ephemeral: true})
        }

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.globalName} vs ${userBeingChallenged.globalName}`)
        .setDescription("Pick a side: Heads or tails?")
        .setColor("Green")

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`heads-button-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Heads")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId(`tails-button-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Tails")
                .setStyle(ButtonStyle.Primary)
        )

        await interaction.reply({embeds: [embed], components: [buttons]})
    }
}

module.exports = {HeadsOrTailsCommand}