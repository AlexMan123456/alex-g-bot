const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const formatDateAndTime = require("../../utils/format-date-and-time");

class RoleCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("role")
                .setDescription("Get information about a given role")
                .addRoleOption((option) => {
                    return option
                        .setName("role")
                        .setDescription("The role to get information about")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const role = interaction.options.getRole("role")
        const {date, time} = formatDateAndTime(new Date(role.createdTimestamp).toISOString())

        console.log(role)

        const embed = new EmbedBuilder()
            .setTitle(role.name)
            .setColor(role.color)
            .addFields(
                {name: "Role", value: `<@${role.id}>`},
                //{name: "Permissions", value: role.permissions},
                {name: "Mentionable", value: role.mentionable ? "Yes" : "No"},
                {name: "Created on", value: `${date}, ${time}`}
            )
        
        await interaction.reply({embeds: [embed]})
    }
}

module.exports = {RoleCommand}