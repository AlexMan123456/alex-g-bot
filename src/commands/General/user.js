const { Command } = require("@sapphire/framework")
const { getUserById, postUser } = require("../../database-interactions/users.js")
const formatDateAndTime = require("../../utils/format-date-and-time.js")
const logError = require("../../utils/log-error.js")
const { EmbedBuilder } = require("discord.js")

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
        const member = interaction.options.getMember("user") ?? interaction.member

        try {
            const {date: joinDate, time: joinTime} = formatDateAndTime(new Date(member.joinedTimestamp).toISOString())

            const embed = new EmbedBuilder()
            .setTitle(user.globalName)
            .setAuthor({name: interaction.user.username})
            .setThumbnail(member.displayAvatarURL())
            .setColor("Green")
            .addFields(
                {name: "Username:", value: user.username},
                {name: "Bot user:", value: user.bot ? "Yes" : "No"},
                {name: "Joined server on:", value: `${joinDate}, ${joinTime}`},
            )

            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Error fetching user. Please try again later.", ephemeral: true})
            await logError(interaction, err)
        }
    }
}

module.exports = {UserCommand}