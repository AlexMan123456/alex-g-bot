const { container } = require("@sapphire/framework")
const { database } = container

const allAttributes = {
    user_id: true,
    username: true,
    global_name: true,
    bot_user: true,
    guilds: {
        select: {
            guild: true,
            joined_at: true
        }
    },
    suggestions: {
        select: {
            title: true,
            description: true,
            resolved: true,
        }
    }
}

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
                        guild_id: guild.id,
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
    return database.user.findUnique({
        select: allAttributes,
        where: {user_id}
    }).then((user) => {
        return user
    })
}

module.exports = { postUser, getUserById }