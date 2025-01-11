const { Listener } = require("@sapphire/framework")
const { postUser, getUserById } = require("../database-interactions/users.js")
const { addUserAndGuildRelation } = require("../database-interactions/usersAndGuilds.js")
const { getGuildById } = require("../database-interactions/guilds.js")
const formatUserGuildMessage = require("../utils/format-user-guild-message.js")
const logError = require("../utils/log-error.js")

class UserListener extends Listener {
    constructor(context, options) {
        super(context, {
          ...options,
          event: "guildMemberAdd"
        })
    }

    async run(client){
        try {
            await getUserById(client.user.id)
            ?
            await addUserAndGuildRelation(client.user.id, client.guild.id, new Date(client.joinedTimestamp))
            :
            await postUser(client.user, client.guild, new Date(client.joinedTimestamp))
        } catch(err) {
            return await logError(client, err)
        }
        
        try {
            const guild = await getGuildById(client.guild.id)
            if(!guild.welcome_channel_id){
                return
            }
            const welcomeChannel = await client.guild.channels.cache.get(guild.welcome_channel_id)
            const welcomeMessage = formatUserGuildMessage(guild.welcome_message, `<@${client.user.id}>`, client.guild.name)
            await welcomeChannel.send(welcomeMessage)
        } catch(err) {
            try {
                const guild = await getGuildById(client.guild.id)
                const welcomeChannel = await client.guild.channels.cache.get(guild.welcome_channel_id)
                await welcomeChannel.send(formatUserGuildMessage(guild.welcome_message, client.user.username, client.guild.name))
            } catch(err) {
                await logError(client, err)
            }
        }
    }
}

module.exports = {UserListener}