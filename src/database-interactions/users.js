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
            status: true,
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
        where: {user_id},
        include: {
            suggestions: true
        }
    }).then((user) => {
        return user
    })
}

function patchUser(user_id, data){
    return database.user.update({
        where: {user_id},
        data
    })
}

module.exports = { postUser, getUserById, patchUser }