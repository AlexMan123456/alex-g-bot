const { container } = require("@sapphire/framework")
const { database } = container

function removeUserFromGuild(user_id, guild_id){
    return database.usersAndGuilds.delete({
        where: {
            user_id_guild_id: {
                user_id, guild_id
            }
        }
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

module.exports = {removeUserFromGuild, addUserAndGuildRelation}