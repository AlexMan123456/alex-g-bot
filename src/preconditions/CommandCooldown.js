const { Precondition } = require("@sapphire/framework");
const { deleteCommandCooldown, getCommandCooldownByUserGuildAndName } = require("../database-interactions/command-cooldowns");
const getFullCommandName = require("../utils/get-full-command-name");
const formatDateAndTime = require("../utils/format-date-and-time");
const logError = require("../utils/log-error");

class UserPrecondition extends Precondition {
    /**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
    async chatInputRun(interaction){
        try {
            const commandName = getFullCommandName(interaction.command.name, interaction.options._subcommand)
            //check cooldown exists
            const cooldown = await getCommandCooldownByUserGuildAndName(interaction.user.id, interaction.guild.id, commandName)
            if(!cooldown){
                return this.ok()
            }
            return await this.checkCooldownExpired(interaction, cooldown.cooldown_expiry, commandName)
        } catch(err) {
            await logError(interaction, err)
            return this.error({message: "Could not get cooldown for this command.", context: {ephemeral: true}})
        }
    }

    async checkCooldownExpired(interaction, cooldownExpiry, commandName){
        const {date: expiryDate, time: expiryTime} = formatDateAndTime(cooldownExpiry.toISOString())
        try {
            if(Date.now() >= cooldownExpiry){
                await deleteCommandCooldown(interaction.user.id, interaction.guild.id, commandName)
                return this.ok()
            }
            return this.error({message: `This command is on a cooldown until ${expiryDate}, ${expiryTime}. Please try again <t:${new Date(cooldownExpiry.getTime()/1000).getTime()}:R>`, context: {ephemeral: true}})
        } catch(err) {
            await logError(interaction, err)
            return this.error({message: "Could not get cooldown for this command.", context: {ephemeral: true}})
        }
    }
}

module.exports = {UserPrecondition}