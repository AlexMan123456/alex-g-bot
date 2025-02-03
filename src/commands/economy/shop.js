const { Subcommand } = require("@sapphire/plugin-subcommands");
const logError = require("../../utils/log-error");
const { getItemsFromGuild, postItemToGuild } = require("../../database-interactions/items");

class ShopCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "items",
                    chatInputRun: "chatInputItems",
                    default: true
                },
                {
                    name: "add-item",
                    chatInputRun: "chatInputAddItem"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("shop")
            .setDescription("Put the in-server money you've earned to use")
            .addSubcommand((command) => {
                return command
                .setName("items")
                .setDescription("View all items")
            })
            .addSubcommand((command) => {
                return command
                .setName("add-item")
                .setDescription("Add an item to the shop")
                .addStringOption((option) => {
                    return option
                    .setName("name")
                    .setDescription("The name of the item")
                    .setRequired(true)
                })
                .addNumberOption((option) => {
                    return option
                    .setName("price")
                    .setDescription("The price of the item")
                    .setRequired(true)
                })
                .addStringOption((option) => {
                    return option
                    .setName("description")
                    .setDescription("Description of item")
                })
                .addNumberOption((option) => {
                    return option
                    .setName("stock")
                    .setDescription("The amount in stock available (leave empty for infinite)")
                })
            });
        })
    }

    async chatInputItems(interaction){
        try {
            const items = await getItemsFromGuild(interaction.guild.id);
            await interaction.reply(JSON.stringify(items));
        } catch(err) {
            await interaction.reply({content: "Could not get items. Please try again later.", ephemeral: true});
            await logError(err);
        }
    }

    async chatInputAddItem(interaction){
        try {
            const name = interaction.options.getString("name");
            const description = interaction.options.getString("description");
            const price = interaction.options.getNumber("price");
            const stock = interaction.options.getNumber("stock");

            const postedItem = await postItemToGuild(interaction.guild.id, name, description, price, stock);

            await interaction.reply(JSON.stringify(postedItem));
        } catch(err) {
            await interaction.reply({content: "Could not add item to shop. Please try again later.", ephemeral: true});
            await logError(interaction, err);
        }
    }
}

module.exports = {ShopCommand}