const { container } = require("@sapphire/framework")
const { database } = container

function postUser(user, guild, joined_at){
    return database.user.create({
        data: {
            user_id: user.id,
            username: user.username,
            global_name: user.globalName ?? user.username,
            bot_user: user.bot,
            guilds: {
                create: [
                    {
                        guild_id: guild.guild_id,
                        joined_at
                    }
                ]
            }
        }
    }).then((user) => {
        return user
    })
}

function getUserById(user_id){
    return database.user.findUnique({where: {user_id}}).then((user) => {
        return user
    })
}

module.exports = { postUser, getUserById }