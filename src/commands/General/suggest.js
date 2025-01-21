const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js")
const { getUserById, postUser } = require("../../database-interactions/users")
const { postSuggestion } = require("../../database-interactions/suggestions")
const logError = require("../../utils/log-error")
const { Subcommand } = require("@sapphire/plugin-subcommands")
const { stripIndents } = require("common-tags")
const { getGuildById, patchGuild } = require("../../database-interactions/guilds")

class SuggestCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            subcommands: [
                {
                    name: "create",
                    chatInputRun: "chatInputCreate",
                    preconditions: ["SuggestionsChannelSet"]
                },
                {
                    name: "view",
                    chatInputRun: "chatInputView"
                },
                {
                    name: "set-channel",
                    chatInputRun: "chatInputSetChannel",
                    preconditions: [["OwnerOnly", "ModOnly"]]
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("suggestions")
                .setDescription("Manage your suggestions to the bot")
                .addSubcommand((command) => {
                    return command
                        .setName("create")
                        .setDescription("Suggest a feature to be added to the bot")
                        /*.addStringOption((option) => {
                            return option
                                .setName("title")
                                .setDescription("The title of your suggestion")
                                .setRequired(true)
                        })
                        .addStringOption((option) => {
                            return option
                                .setName("description")
                                .setDescription("Describe the main features of your suggestion")
                                .setRequired(true)
                        })*/
                })
                .addSubcommand((command) => {
                    return command
                        .setName("view")
                        .setDescription("View all your suggestions to the bot")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("set-channel")
                        .setDescription("(ADMIN ONLY) Set the channel you want to receive suggestions in")
                        .addChannelOption((option) => {
                            return option
                                .setName("channel")
                                .setDescription("The channel to set as the suggestions channel")
                                .setRequired(true)
                        })
                })
        })
    }

    async chatInputCreate(interaction){
        const modal = new ModalBuilder()
        .setCustomId("createSuggestion")
        .setTitle("Create a suggestion")

        const title = new TextInputBuilder()
        .setCustomId("suggestionTitle")
        .setLabel("Suggestion Title")
        .setStyle(TextInputStyle.Short)

        const description = new TextInputBuilder()
        .setCustomId("suggestionDescription")
        .setLabel("Suggestion Description")
        .setStyle(TextInputStyle.Paragraph)

        modal.addComponents(
            new ActionRowBuilder().addComponents(title),
            new ActionRowBuilder().addComponents(description)
        )

        await interaction.showModal(modal)
    }

    async chatInputView(interaction){
        const {suggestions} = await getUserById(interaction.user.id)

        const embed = new EmbedBuilder()
            .setTitle("All suggestions")
            .setAuthor({name: interaction.user.globalName})
            .addFields(
                ...suggestions.map((suggestion) => {
                    return {name: suggestion.title, value: stripIndents(
                        `${suggestion.description}
                        *Status: ${suggestion.status}*`
                    )}
                })
            )
        
        await interaction.reply({embeds: [embed]})
    }

    async chatInputSetChannel(interaction){
        const suggestionsChannel = interaction.options.getChannel("channel")
        try {
            await patchGuild(interaction.guild.id, {suggestions_channel_id: suggestionsChannel.id})
            await interaction.reply(`Suggestions channel set to <#${suggestionsChannel.id}>.`)
        } catch(err) {
            await interaction.reply("Could not set suggestions channel.")
            await logError(interaction, err)
        }

    }
}

async function addSuggestionToDatabase(suggestion, interaction){
    const {user, member, guild} = interaction
    const author = await getUserById(user.id)
    if(!author){
        await postUser(user, guild, member.joinedAt)
    }
    return await postSuggestion(suggestion, user.id)
}


module.exports = {SuggestCommand}