const { Subcommand } = require("@sapphire/plugin-subcommands");
const logError = require("../../utils/log-error");
const { getItemsFromGuild, postItemToGuild, getItemsByName } = require("../../database-interactions/items");
const { EmbedBuilder } = require("discord.js");
const { getGuildById } = require("../../database-interactions/guilds");

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
                    chatInputRun: "chatInputAddItem",
                    preconditions: [["OwnerOnly", "ModOnly"]]
                },
                {
                    name: "buy",
                    chatInputRun: "chatInputBuy"
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
            })
            .addSubcommand((command) => {
                return command
                .setName("buy")
                .setDescription("Buy an item")
                .addStringOption((option) => {
                    return option
                    .setName("item")
                    .setDescription("The name of the item to buy")
                    .setRequired(true)
                })
            });
        })
    }

    async chatInputItems(interaction){
        try {
            const items = await getItemsFromGuild(interaction.guild.id);
            const {currency_symbol} = await getGuildById(interaction.guild.id);
            
            const embed = new EmbedBuilder()
            .setTitle("Items")
            .setColor("Blue")
            .addFields(
                ...items.map((item) => {
                    return {name: `${item.name}: ${currency_symbol}${item.price}`, value: (item.description ?? " ") + (item.stock ? `\n**Stock:** ${item.stock}` : "")}
                })
            )
            
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: "Could not get items. Please try again later.", ephemeral: true});
            await logError(interaction, err);
        }
    }

    async chatInputAddItem(interaction){
        try {
            const name = interaction.options.getString("name");
            const description = interaction.options.getString("description");
            const price = interaction.options.getNumber("price");
            const stock = interaction.options.getNumber("stock");

            const postedItem = await postItemToGuild(interaction.guild.id, name, description, price, stock);
            const {currency_symbol} = await getGuildById(interaction.guild.id);

            const embed = new EmbedBuilder()
            .setTitle("Item posted")
            .setAuthor({name: interaction.user.globalName})
            .setColor("Green")
            .addFields({name: `${postedItem.name}: ${currency_symbol}${postedItem.price}`, value: (postedItem.description ?? " ") + (postedItem.stock ? `\n**Stock:** ${postedItem.stock}` : "")})

            await interaction.reply({embeds: [embed]});
        } catch(err) {
            await interaction.reply({content: "Could not add item to shop. Please try again later.", ephemeral: true});
            await logError(interaction, err);
        }
    }

    async chatInputBuy(interaction){
        const itemName = interaction.options.getString("item");

        const potentialItems = await getItemsByName(itemName);

        /*if(potentialItems === 1){
            
        }*/
    }
}

module.exports = {ShopCommand}