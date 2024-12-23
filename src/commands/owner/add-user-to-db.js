const { EmbedBuilder } = require("@discordjs/builders");
const { Command, container } = require("@sapphire/framework");

class AddUserToDatabase extends Command {
    constructor(context, options){
        super(context, {...options, preconditions: ["OwnerOnly"]})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("add-user-to-db")
                .setDescription("Add a user to the bot's database")
                .addUserOption((option) => {
                    return option
                        .setName("user")
                        .setDescription("(OWNER ONLY) The user to add to the database")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const user = interaction.options.getUser("user")
        const {database} = container
        
        try {
            const userInDb = await database.user.create({
                data: {
                    user_id: user.id,
                    username: user.username,
                    global_name: user.globalName ?? user.username,
                    bot_user: user.bot
                }
            })

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
}

module.exports = {AddUserToDatabase}