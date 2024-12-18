const { EmbedBuilder } = require("@discordjs/builders")
const { Command } = require("@sapphire/framework")
const { MessageFlags } = require("discord.js")

class UserCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("user")
                .setDescription("Get information about a user")
                .addUserOption((option) => {
                    return option.setName("user").setDescription("The user to get information about")
                })
        })
    }

    async chatInputRun(interaction){
        const user = interaction.options.getUser("user") ?? interaction.user
        const member = interaction.options.getMember("member") ?? interaction.member
        
        const embed = new EmbedBuilder()
		.setTitle(user.globalName ? user.globalName : user.username)
		.setAuthor({name: interaction.user.username})
		.setThumbnail(member.displayAvatarURL())
		.addFields(
			{name: "Username:", value: user.username},
			{name: "Bot user:", value: `${user.bot}`},
			{name: "Joined server on:", value: `${member.joinedAt}`}
		)
	try{
		await interaction.reply({embeds: [embed]})
	}catch(err){
		await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
	}
    }
}

module.exports = {UserCommand}