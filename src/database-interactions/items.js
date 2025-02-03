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
        return item;
    })
}

function getItemsByName(name){
    return database.items.findMany({
        where: {name}
    }).then((items) => {
        return items;
    })
}

function patchItem(item_id, data){
    return database.items.update({
        where: {item_id},
        data
    }).then((item) => {
        return item
    })
}

module.exports = { getItemsFromGuild, postItemToGuild, getItemsByName, patchItem };