const { EmbedBuilder } = require("discord.js");
const { patchItem, addItemToUser } = require("../database-interactions/items");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../database-interactions/users-and-guilds");
const logError = require("../utils/log-error");
const { getGuildById } = require("../database-interactions/guilds");

async function giveItemToUser(interaction, itemToBuy){
    const {money_current: previousCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id);
    if(itemToBuy.price > previousCurrent){
        return await interaction.reply({content: "You do not have enough money to purchase this item.", ephemeral: true})
    }

    if(itemToBuy.stock <= 0 && itemToBuy.stock !== null) {
        return await interaction.reply({content: "This item is out of stock.", ephemeral: true});
    }
    
    const newCurrent = previousCurrent - itemToBuy.price;
    try {
        await addItemToUser(interaction.user.id, itemToBuy.item_id);
    } catch(err) {
        if(err.code === "P2002"){
            return await interaction.reply({content: "You already own this item!", ephemeral: true});
        }
        await interaction.reply({content: "Could not complete purchase. Please try again later.", ephemeral: true});
        await logError(interaction, err);
    }
    await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent});

    if(itemToBuy.stock > 0){
        const newStock = itemToBuy.stock - 1;
        await patchItem(itemToBuy.item_id, {stock: newStock});
    }
    
    const {currency_symbol} = await getGuildById(interaction.guild.id);

    const embed = new EmbedBuilder()
    .setTitle("Item purchased")
    .setColor("Green")
    .addFields(
        {name: `${itemToBuy.name}: ${currency_symbol}${itemToBuy.price}`, value: (itemToBuy.description ?? " ")},
        {name: `${interaction.user.globalName}: Current`, value: `${currency_symbol}${previousCurrent} → ${currency_symbol}${newCurrent}`}
    )
    
    await interaction.message.edit({content: `${itemToBuy.name} bought successfully! See below message for details.`, components: []});
    return await interaction.reply({embeds: [embed]});
}

module.exports = giveItemToUser;