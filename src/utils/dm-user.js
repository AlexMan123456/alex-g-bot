async function DMUser(user, args){
    try {
        await user.send(args)
        return {DMSent: true}
    } catch(err) {
        return {DMSent: false}
    }
}

module.exports = DMUser