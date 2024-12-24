const { EmbedBuilder } = require("discord.js")
const postGuild = require("../../database-interactions/guilds.js")

async function addGuildToDatabase(interaction){
    try {
        const guildInDb = await postGuild(interaction.guild)
        const embed = new EmbedBuilder()
            .setTitle("Guild added")
            .setAuthor({name: interaction.user.globalName})
            .addFields(
                {name: "id", value: guildInDb.guild_id},
                {name: "name", value: guildInDb.name}
            )
        
        await interaction.reply({embeds: [embed]})
    } catch(err) {
        await interaction.reply({content: `${err}`, ephemeral: true})
    }

}

module.exports = addGuildToDatabase