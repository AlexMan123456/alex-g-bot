const { EmbedBuilder } = require("discord.js");
const { patchItem, addItemToUser } = require("../database-interactions/items");
const { getUserAndGuildRelation, patchUserAndGuildRelation } = require("../database-interactions/users-and-guilds");
const logError = require("../utils/log-error");

async function giveItemToUser(interaction, itemToBuy){
    const {money_current: previousCurrent} = await getUserAndGuildRelation(interaction.user.id, interaction.guild.id);
    const reply = interaction.replied ? "editReply" : "reply";
    console.log(itemToBuy)
    if(itemToBuy.price > previousCurrent){
        return await interaction.reply({content: "You do not have enough money to purchase this item.", ephemeral: true})
    }

    if(itemToBuy.stock > 0){
        const newStock = itemToBuy.stock - 1;
        await patchItem(itemToBuy.item_id, {stock: newStock});
    } else if(itemToBuy.stock && itemToBuy.stock <= 0) {
        return await interaction.reply({content: "This item is out of stock.", ephemeral: true});
    }
    
    const newCurrent = previousCurrent - itemToBuy.price;
    await addItemToUser(interaction.user.id, itemToBuy.item_id);
    await patchUserAndGuildRelation(interaction.user.id, interaction.guild.id, {money_current: newCurrent});

    const embed = new EmbedBuilder()
    .setTitle("Item purchased")
    .setColor("Green")
    .addFields(
        {name: itemToBuy.name, value: (itemToBuy.description ?? " ")}
    )

    return await interaction.reply({embeds: [embed]});
}

module.exports = giveItemToUser;