const { Command } = require("@sapphire/framework");
const { getAllCommandCooldownsOfUserFromGuild, deleteCommandCooldown } = require("../../database-interactions/command-cooldowns");
const { EmbedBuilder } = require("discord.js");
const { stripIndents } = require("common-tags");
const formatDateAndTime = require("../../utils/format-date-and-time");

class CooldownCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("view-cooldowns")
            .setDescription("View all active command cooldowns")
        })
    }

    async chatInputRun(interaction){
        const cooldowns = await getAllCommandCooldownsOfUserFromGuild(interaction.user.id, interaction.guild.id)
        const activeCooldowns = []
        for(const cooldown of cooldowns){
            if(Date.now() >= cooldown.cooldown_expiry.getTime()){
                await deleteCommandCooldown(interaction.user.id, interaction.guild.id, cooldown.name)
            } else {
                activeCooldowns.push(cooldown)
            }
        }

        const embed = new EmbedBuilder()
        .setTitle("Active command cooldowns")
        .setDescription(activeCooldowns.length === 0 ? "No cooldowns currently active" : null)
        .addFields(
            ...activeCooldowns.map((cooldown) => {
                const {date, time} = formatDateAndTime(cooldown.cooldown_expiry.toISOString())
                return {name: cooldown.name, value: stripIndents(
                    `Active until ${date}, ${time}
                    Expires <t:${new Date(cooldown.cooldown_expiry.getTime()/1000).getTime()}:R>`
                )}
            })
        )
        .setColor(activeCooldowns.length === 0 ? "Red" : "Green")

        await interaction.reply({embeds: [embed]})
    }
}

module.exports = {CooldownCommand}