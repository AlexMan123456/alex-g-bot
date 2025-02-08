const { container } = require("@sapphire/framework");
const { database } = container;

function postKick(data){
    return database.punishments.create({data}).then((punishment) => {
        return punishment
    })
}

module.exports = {postKick}