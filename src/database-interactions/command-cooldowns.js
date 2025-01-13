const { container } = require("@sapphire/framework")
const { database } = container

function getCommandCooldown(user_id, guild_id){
    return database.commandCooldowns.findFirst({
        where: {
            user_id, guild_id
        }
    }).then((cooldown) => {
        return cooldown
    })
}

function postCommandCooldown(name, user_id, guild_id, cooldown_expiry){
    return database.commandCooldowns.create({
        data: {
            user_id, guild_id, name, cooldown_expiry
        },
        select: {
            user_in_guild: {
                select: {
                    user_id: true,
                    guild_id: true
                }
            },
            cooldown_expiry: true,
            name: true
        }
    }).then((cooldown) => {
        return cooldown
    })
}

function deleteCommandCooldown(user_id, guild_id, name){
    return database.commandCooldowns.deleteMany({
        where: {
            user_id, guild_id
        }
    })
}

module.exports = { postCommandCooldown, deleteCommandCooldown, getCommandCooldown }