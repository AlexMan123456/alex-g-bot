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

function deleteItem(item_id){
    return database.items.delete({
        where: {item_id}
    })
}

function addItemToUser(user_id, item_id){
    return database.usersAndItems.create({
        data: {user_id, item_id}
    }).then((relation) => {
        return relation
    })
}

function getItemsPurchasedByUser(user_id){
    return database.usersAndItems.findMany({
        where: {user_id},
        include: {item: true}
    }).then((items) => {
        return items
    })
}

module.exports = { getItemsFromGuild, postItemToGuild, getItemsByName, patchItem, deleteItem, addItemToUser, getItemsPurchasedByUser };