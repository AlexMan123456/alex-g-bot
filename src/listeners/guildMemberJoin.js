const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { addUserAndGuildRelation } = require("../database-interactions/usersAndGuilds.js")
const findChannel = require("../utils/find-channel.js")

class UserListener extends Listener {
    constructor(context, options) {
        super(context, {
          ...options,
          event: "guildMemberAdd"
        })
    }

    async run(client){
        await getUserById(client.user.id)
        ?
        await addUserAndGuildRelation(client.user.id, client.guild.id, new Date(client.joinedTimestamp))
        :
        await postUser(client.user, client.guild, new Date(client.joinedTimestamp))

        const welcomeLeaveChannel = await client.guild.channels.fetch().then((data) => {
            return findChannel([...data], "welcome-leave")
        }).then((channelData) => {
            return client.guild.channels.cache.get(channelData[0])
        })
        try {
            await welcomeLeaveChannel.send(`<@${client.user.id}> has joined ${client.guild.name}!`)
        } catch(err) {
            await welcomeLeaveChannel.send(`${client.user.username} has joined ${client.guild.name}`)
        }
    }
}

module.exports = {UserListener}