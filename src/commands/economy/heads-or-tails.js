const { Command } = require("@sapphire/framework");
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { getUserAndGuildRelation } = require("../../database-interactions/users-and-guilds");

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

        
        // Validate if the user can even play the game
        if(userBeingChallenged.id === interaction.user.id){
            return await interaction.reply({content: "Are you really trying to play heads or tails by yourself? Try playing with a friend, if you have any!", ephemeral: true})
        }
        
        const {money_current: userChallengingCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id);
        const {money_current: userBeingChallengedCurrent} = await getUserAndGuildRelation(userBeingChallenged.id, interaction.guild.id);

        if(userChallengingCurrent <= 0){
            return await interaction.reply("You don't even have enough money to gamble!")
        }
        if(userBeingChallengedCurrent <= 0){
            return await interaction.reply(`${userBeingChallenged.globalName} doesn't even have enough money to gamble with!`)
        }
        //

        const embed = new EmbedBuilder()
        .setTitle(`${interaction.user.globalName} challenges you, ${userBeingChallenged.globalName}, to a game of heads and tails!`)
        .setDescription("Do you accept?")
        .setColor("Orange")

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`heads-or-tails-challenge-accept-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId(`heads-or-tails-challenge-deny-challenged-user-id-${userBeingChallenged.id}`)
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger)
        )

        await interaction.reply({content: `<@${userBeingChallenged.id}>`, embeds: [embed], components: [buttons]});
    }
}

module.exports = {HeadsOrTailsCommand}