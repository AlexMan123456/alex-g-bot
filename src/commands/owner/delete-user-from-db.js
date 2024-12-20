const { PrismaClient } = require("@prisma/client");
const { Command } = require("@sapphire/framework");

class DeleteUserFromDatabase extends Command {
    constructor(context, options){
        super(context, {...options, preconditions: ["OwnerOnly"]})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("delete-user-from-db")
                .setDescription("Delete a user from the database")
                .addUserOption((option) => {
                    return option
                        .setName("user")
                        .setDescription("The user to remove from the database")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const user = interaction.options.getUser("user")
        const prisma = new PrismaClient()

        try {
            await prisma.user.delete({
                where: {
                    user_id: user.id
                }
            })
            await interaction.reply(`Removed ${user.username} from database`)
        } catch(err) {
            await interaction.reply({content: `Could not find ${user.username} in database`, ephemeral: true})
        }
    }
}

module.exports = {DeleteUserFromDatabase}