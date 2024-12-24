const { container } = require("@sapphire/framework")
const { EmbedBuilder } = require("discord.js")
const { postUser } = require("../../database-interactions/users.js")

async function addUserToDatabase(interaction){
    const user = interaction.options.getUser("user")
    
    try {
        const userInDb = await postUser(user)

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