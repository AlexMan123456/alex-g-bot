const { Subcommand } = require("@sapphire/plugin-subcommands");
const logError = require("../../utils/log-error");
const { getItemsFromGuild, postItemToGuild, getItemsByName, getItemsPurchasedByUser } = require("../../database-interactions/items");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");
const { getGuildById } = require("../../database-interactions/guilds");
const giveItemToUser = require("../../miscellaneous/give-item-to-user");

class ShopCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "add-item",
                    chatInputRun: "chatInputAddItem",
                    preconditions: [["OwnerOnly", "ModOnly"]]
                },
                {
                    name: "purchased-items",
                    chatInputRun: "chatInputPurchasedItems"
                },
                {
                    name: "buy",
                    chatInputRun: "chatInputSelectItems"
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
                .setName("purchased-items")
                .setDescription("View all items you've purchased")
            })
            .addSubcommand((command) => {
                return command
                .setName("buy")
                .setDescription("Select an item to buy")
            });
        })
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
            .addFields({name: `${postedItem.name}: ${currency_symbol}${postedItem.price}`, value: (postedItem.description ?? " ") + (postedItem.stock !== null ? `\n**Stock:** ${postedItem.stock}` : "")})

            await interaction.reply({embeds: [embed]});
        } catch(err) {
            await interaction.reply({content: "Could not add item to shop. Please try again later.", ephemeral: true});
            await logError(interaction, err);
        }
    }

    async chatInputPurchasedItems(interaction){
        const items = await getItemsPurchasedByUser(interaction.user.id).then((items) => {
            return items.map(({item}) => {
                return item
            })
        });

        const embed = new EmbedBuilder()
        .setTitle("All purchased items")
        .setAuthor({name: interaction.user.globalName})
        .setColor("Green")
        .addFields(
            ...items.map((item) => {
                return {name: item.name, value: item.description ?? " "}
            })
        )

        await interaction.reply({embeds: [embed]})
    }

    async chatInputSelectItems(interaction){
        const items = await getItemsFromGuild(interaction.guild.id);

        if(items.length === 0){
            return await interaction.reply("There are no items for sale yet!");
        }

        const {currency_symbol} = await getGuildById(interaction.guild.id);

        const select = new StringSelectMenuBuilder()
        .setCustomId("shop-select-menu")
        .setPlaceholder("Select an item to buy.")
        .addOptions(
            ...items.filter((item) => {
                return item.stock === null || item.stock > 0;
            }).map((item) => {
                return new StringSelectMenuOptionBuilder()
                .setLabel(`${item.name}: ${currency_symbol}${item.price}`)
                .setDescription((item.description ?? "") + " " + (item.stock !== null ? `[Stock: ${item.stock}]` : ""))
                .setValue(`item-${item.item_id}`)
            })
        )

        const components = new ActionRowBuilder().addComponents(select);

        await interaction.reply({content: "Select an item to buy.", components: [components]});
    }
}

module.exports = {ShopCommand}