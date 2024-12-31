const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { addUserAndGuildRelation } = require("../database-interactions/usersAndGuilds.js")
const findChannel = require("../utils/find-channel.js")
const { getGuildById } = require("../database-interactions/guilds.js")
const formatUserGuildMessage = require("../utils/format-user-guild-message.js")

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

        const welcomeMessage = await getGuildById(client.guild.id).then((guild) => {
            return formatUserGuildMessage(guild.welcome_message, `<@${client.user.id}>`, client.guild.name)
        })

        try {
            await welcomeLeaveChannel.send(welcomeMessage)
        } catch(err) {
            await welcomeLeaveChannel.send(formatUserGuildMessage(guild.welcome_message, client.user.username, client.guild.name))
        }
    }
}

module.exports = {UserListener}