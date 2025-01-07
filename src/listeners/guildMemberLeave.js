const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { removeUserFromGuild } = require("../database-interactions/usersAndGuilds.js")
const findChannel = require("../utils/find-channel.js")
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
            const welcomeLeaveChannel = await findChannel(client, "welcome-leave").then((channelData) => {
                return client.guild.channels.cache.get(channelData[0])
            })
    
            const leaveMessage = await getGuildById(client.guild.id).then((guild) => {
                return formatUserGuildMessage(guild.leave_message, client.user.username, client.guild.name)
            })
    
            await welcomeLeaveChannel.send(leaveMessage)
        } catch(err) {
            await logError(client, err)
        }
    }
}

module.exports = {UserListener}