const { container } = require("@sapphire/framework")
const { database } = container

function getCommandCooldownByUserGuildAndName(user_id, guild_id, name){
    return database.commandCooldowns.findFirst({
        where: {
            user_id, guild_id, name
        }
    }).then((cooldown) => {
        return cooldown
    })
}

function getAllCommandCooldownsOfUserFromGuild(user_id, guild_id){
    return database.commandCooldowns.findMany({
        where: {
            user_id, guild_id
        }
    }).then((cooldowns) => {
        return cooldowns
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

module.exports = { postCommandCooldown, deleteCommandCooldown, getCommandCooldownByUserGuildAndName, getAllCommandCooldownsOfUserFromGuild }