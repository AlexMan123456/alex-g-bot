const { Precondition } = require("@sapphire/framework");
const { getGuildById } = require("../database-interactions/guilds");

class UserPrecondition extends Precondition {
    /**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
    async chatInputRun(interaction){
        return await this.doModCheck(interaction)
    }

    async doModCheck(interaction){
        const {mod_role_id} = await getGuildById(interaction.guild.id)
        const isMod = interaction.member.roles.cache.has(mod_role_id)
        return isMod ? this.ok() : this.error({message: "Only moderators can run this command", context: {ephemeral: true}})
    }
}

module.exports = {UserPrecondition}