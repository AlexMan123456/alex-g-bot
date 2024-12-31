const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { removeUserFromGuild } = require("../database-interactions/usersAndGuilds.js")
const findChannel = require("../utils/find-channel.js")
const formatUserGuildMessage = require("../utils/format-user-guild-message.js")
const { getGuildById } = require("../database-interactions/guilds.js")

class UserListener extends Listener {
    constructor(context, options) {
        super(context, {
          ...options,
          event: "guildMemberRemove"
        })
    }

    async run(client){
        await removeUserFromGuild(client.user.id, client.guild.id)

        const welcomeLeaveChannel = await client.guild.channels.fetch().then((data) => {
            return findChannel([...data], "welcome-leave")
        }).then((channelData) => {
            return client.guild.channels.cache.get(channelData[0])
        })

        const leaveMessage = await getGuildById(client.guild.id).then((guild) => {
            return formatUserGuildMessage(guild.leave_message, client.user.username, client.guild.name)
        })

        await welcomeLeaveChannel.send(leaveMessage)
    }
}

module.exports = {UserListener}