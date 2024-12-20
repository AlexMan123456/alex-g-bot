const { PrismaClient } = require("@prisma/client");
const { Command } = require("@sapphire/framework");

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
                    return option.setName("user").setDescription("The user to get information about")
                })
        })
    }

    async chatInputRun(interaction){
        const user = interaction.options.getUser("user")

        const prisma = new PrismaClient()
        try {
            await prisma.user.create({
                data: {
                    user_id: user.id,
                    username: user.username,
                    global_name: user.globalName ?? user.username,
                    bot_user: user.bot
                }
            })
            await interaction.reply("User added")
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }

    }
}

module.exports = {AddUserToDatabase}