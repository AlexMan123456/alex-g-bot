const { EmbedBuilder } = require("discord.js")
const { postUser } = require("../../database-interactions/users.js")
const { getGuildById, postGuild } = require("../../database-interactions/guilds.js")

async function addUserToDatabase(interaction){
    const user = interaction.options.getUser("user")
    const {joinedAt} = interaction.options.getMember("user")
    
    try {
        const guild = await getGuildById(interaction.guild.id)
        if(!guild){
            await postGuild(interaction.guild)
        }
        const userInDb = await postUser(user, guild, joinedAt)
        const embed = new EmbedBuilder()
            .setTitle("User added")
            .setAuthor({name: userInDb.username})
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                {name: "user_id", value: userInDb.user_id},
                {name: "username", value: userInDb.username},
                {name: "global_name", value: userInDb.global_name},
                {name: "bot_user", value: `${user.bot}`}
            )

        await interaction.reply({embeds: [embed]})
    } catch(err) {
        await interaction.reply({content: `${err}`, ephemeral: true})
    }
}

module.exports = addUserToDatabase