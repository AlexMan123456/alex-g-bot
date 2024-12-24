const { container } = require("@sapphire/framework")
const { database } = container

function postUser(user){
    return database.user.create({
        data: {
            user_id: user.id,
            username: user.username,
            global_name: user.globalName ?? user.username,
            bot_user: user.bot
        }
    }).then((user) => {
        return user
    })
}

module.exports = { postUser }