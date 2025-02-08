const { container } = require("@sapphire/framework");
const { database } = container;

function postPunishment(data){
    return database.punishments.create({data}).then((punishment) => {
        return punishment
    })
}

module.exports = { postPunishment }