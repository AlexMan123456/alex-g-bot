const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { getItemById } = require("../database-interactions/items");
const giveItemToUser = require("../miscellaneous/give-item-to-user");
const logError = require("../utils/log-error");

class ItemPurchaseHandler extends InteractionHandler {
    constructor(context, options){
        super(context, {
            ...options,
            interactionHandlerType: InteractionHandlerTypes.SelectMenu
        })
    }

    parse(interaction){
        if(interaction.customId === "shop-select-menu"){
            return this.some()
        }
        return this.none()
    }

    async run(interaction){
        try {
            if(interaction.user.id !== interaction.message.interaction.user.id){
                return await interaction.reply({content: "Only the user who initially ran the command can complete this purchase.", ephemeral: true});
            }
            const item = await getItemById(parseInt(interaction.values[0].split("-")[1]));
            await giveItemToUser(interaction, item);
        } catch(err) {
            await interaction.reply({content: "Could not complete purchase. Please try again later.", ephemeral: true});
            await logError(interaction, err);
        }

    }
}

module.exports = {ItemPurchaseHandler}