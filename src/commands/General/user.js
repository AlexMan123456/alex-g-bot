const { EmbedBuilder } = require("@discordjs/builders")
const { Command } = require("@sapphire/framework")
const { MessageFlags } = require("discord.js")
const { getUserById, postUser } = require("../../database-interactions/users.js")
const { getGuildById } = require("../../database-interactions/guilds.js")
const formatDateAndTime = require("../../utils/format-date-and-time.js")

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
        const userFromGuild = interaction.options.getUser("user") ?? interaction.user
        const member = interaction.options.getMember("user") ?? interaction.member

        try {
            const user = await getUserById(userFromGuild.id) ?? await postUser(userFromGuild, interaction.guild, member.joinedAt)
            const currentGuild = user.guilds.find(({guild}) => {
                return guild.guild_id = interaction.guild.id
            })
            const {date: joinDate, time: joinTime} = formatDateAndTime(currentGuild.joined_at.toISOString())

            const embed = new EmbedBuilder()
            .setTitle(user.global_name)
            .setAuthor({name: interaction.user.username})
            .setThumbnail(member.displayAvatarURL())
            .addFields(
                {name: "Username:", value: user.username},
                {name: "Bot user:", value: user.bot_user ? "Yes" : "No"},
                {name: "Joined server on:", value: `${joinDate}, ${joinTime}`},
            )

            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }
}

module.exports = {UserCommand}