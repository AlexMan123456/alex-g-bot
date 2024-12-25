const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { removeUserFromGuild } = require("../database-interactions/usersAndGuilds.js")
const findChannel = require("../utils/find-channel.js")

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

        await welcomeLeaveChannel.send(`${client.user.username} has left ${client.guild.name}.`)
    }
}

module.exports = {UserListener}