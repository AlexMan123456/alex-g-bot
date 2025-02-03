const { container } = require("@sapphire/framework");
const { database } = container;

function getItemsFromGuild(guild_id){
    return database.items.findMany({
        where: {
            guild: {guild_id}
        }
    }).then((items) => {
        return items
    })
}

function postItemToGuild(guild_id, name, description, price, stock){
    const data = {guild_id, name, price}

    if(price){
        data.description = description;
    }
    if(stock){
        data.stock = stock;
    }

    return database.items.create({data}).then((item) => {
        return item
    })
}

module.exports = { getItemsFromGuild, postItemToGuild }