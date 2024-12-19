const { PrismaClient } = require("@prisma/client");
const { Command } = require("@sapphire/framework");
const { MessageFlags } = require("discord.js");

class SeedCommand extends Command {
    constructor(context, options){
        super(context, {...options, preconditions: ["OwnerOnly"]})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder.setName("seed").setDescription("Seed the bot's database")
        })
    }

    async chatInputRun(interaction){
        const prisma = new PrismaClient()
        await prisma.user.deleteMany({})
        const data = [...interaction.guild.members.cache].map((member) => {
            const {username, globalName, bot} = member[1].user
            return {user_id: member[0], username, global_name: globalName ?? username, bot_user: bot}
        })
        try {
            await prisma.user.createMany({data, skipDuplicates: true})
            await interaction.reply({content: "Database seeded", flags: MessageFlags.Ephemeral})
        } catch(err) {
            await interaction.reply({content: `${err}`, flags: MessageFlags.Ephemeral})
        }
    }
}

module.exports = {SeedCommand}