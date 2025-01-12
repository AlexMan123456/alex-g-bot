const { Precondition } = require("@sapphire/framework");
const { postCommandCooldown, deleteCommandCooldown, getCommandCooldown } = require("../database-interactions/command-cooldowns");
const getFullCommandName = require("../utils/get-full-command-name");
const getCooldownExpiry = require("../utils/get-cooldown-expiry");
const formatDateAndTime = require("../utils/format-date-and-time");
const logError = require("../utils/log-error");

class UserPrecondition extends Precondition {
    /**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
    async chatInputRun(interaction){
        try {
            //check cooldown exists
            const cooldown = await getCommandCooldown(interaction.user.id, interaction.guild.id)
            if(!cooldown){
                await this.setCommandCooldown(interaction)
            }

            return !cooldown ? this.ok() : await this.checkCooldownExpired(interaction, cooldown.cooldown_expiry)
        } catch(err) {
            await logError(interaction, err)
            return this.error({message: "Could not get cooldown for this command.", context: {ephemeral: true}})
        }
    }

    async setCommandCooldown(interaction){
        const commandName = getFullCommandName(interaction.command.name, interaction.options._subcommand)
        return await postCommandCooldown(commandName, interaction.user.id, interaction.guild.id, getCooldownExpiry(commandName))
    }

    async checkCooldownExpired(interaction, cooldown_expiry){
        const {date: expiryDate, time: expiryTime} = formatDateAndTime(cooldown_expiry.toISOString())
        try {
            if(Date.now() >= cooldown_expiry){
                await deleteCommandCooldown(interaction.user.id, interaction.guild.id)
                return this.ok()
            }
            return this.error({message: `This command is on a cooldown. Please try again on ${expiryDate}, ${expiryTime}`, context: {ephemeral: true}})
        } catch(err) {
            await logError(interaction, err)
            return this.error({message: "Could not get cooldown for this command.", context: {ephemeral: true}})
        }
    }
}

module.exports = {UserPrecondition}