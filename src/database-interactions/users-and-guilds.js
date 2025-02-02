const { container } = require("@sapphire/framework")
const { deleteAllCommandCooldownsOfUser } = require("./command-cooldowns")
const { database } = container

function removeUserFromGuild(user_id, guild_id){
    return deleteAllCommandCooldownsOfUser(user_id, guild_id).then(() => {
        return database.usersAndGuilds.delete({
            where: {
                user_id_guild_id: {
                    user_id, guild_id
                }
            }
        })
    })
}

function addUserAndGuildRelation(user_id, guild_id, joined_at){
    return database.usersAndGuilds.create({
        data: {
            user_id, guild_id, joined_at
        }
    }).then((relation) => {
        return relation
    })
}

function patchUserAndGuildRelation(user_id, guild_id, data){
    return database.usersAndGuilds.update({
        where: {
            user_id_guild_id: {
                user_id, guild_id
            }
        },
        data,
        select: {
            user: {
                select: {
                    user_id: true,
                    username: true
                }
            },
            guild: {
                select: {
                    guild_id: true,
                    name: true
                }
            },
            money_current: true,
            money_savings: true
        }
    }).then((relation) => {
        return relation
    })
}

function getUserAndGuildRelation(user_id, guild_id){
    return database.usersAndGuilds.findUnique({
        select: {
            user: {
                select: {
                    user_id: true,
                    username: true
                }
            },
            guild: {
                select: {
                    guild_id: true,
                    name: true
                }
            },
            money_current: true,
            money_savings: true
        },
        where: {
            user_id_guild_id: {
                user_id, guild_id
            }
        }
    })
}

module.exports = {removeUserFromGuild, addUserAndGuildRelation, patchUserAndGuildRelation, getUserAndGuildRelation}