const { Listener } = require("@sapphire/framework")
const { removeUserFromGuild } = require("../database-interactions/users-and-guilds.js")
const formatUserGuildMessage = require("../utils/format-user-guild-message.js")
const { getGuildById } = require("../database-interactions/guilds.js")
const logError = require("../utils/log-error.js")

class UserListener extends Listener {
    constructor(context, options) {
        super(context, {
          ...options,
          event: "guildMemberRemove"
        })
    }

    async run(client){
        try {
            await removeUserFromGuild(client.user.id, client.guild.id)
        } catch(err) {
            await logError(client, err)
        }
        
        try {
            const guild = await getGuildById(client.guild.id)
            if(!guild.leave_channel_id){
                return
            }
            const leaveChannel = await client.guild.channels.cache.get(guild.leave_channel_id)
            const leaveMessage = formatUserGuildMessage(guild.leave_message, client.user.username, client.guild.name)
            await leaveChannel.send(leaveMessage)
        } catch(err) {
            await logError(client, err)
        }
    }
}

module.exports = {UserListener}