const { Precondition } = require("@sapphire/framework");
const { getGuildById } = require("../database-interactions/guilds");

class SuggestionsChannelSetPrecondition extends Precondition {
    /**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */

    async chatInputRun(interaction){
        return await this.doChannelCheck(interaction.guild.id)
    }

    async doChannelCheck(guild_id){
        const {suggestions_channel_id} = await getGuildById(guild_id)
        if(suggestions_channel_id){
            return await this.ok()
        }
        return await this.error({message: "Suggestions channel not set."})
    }
}

module.exports = {SuggestionsChannelSetPrecondition}