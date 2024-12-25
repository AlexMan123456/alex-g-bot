const { container } = require("@sapphire/framework")

async function addUserToGuild(interaction){
    const user = interaction.options.getUser("user") ?? interaction.user
    const member = interaction.options.getMember("user") ?? interaction.member
    const {database} = container
    try {
        const relation = await database.usersAndGuilds.create({
            data: {
                user_id: user.id,
                guild_id: interaction.guild.id,
                joined_at: member.joinedAt
            }
        })

        await interaction.reply("```js\n" + JSON.stringify(relation, null, 2) + "```")
    } catch(err) {
        await interaction.reply({content: `${err}`, ephemeral: true})
    }
}

module.exports = addUserToGuild