const { Subcommand } = require("@sapphire/plugin-subcommands");
const { EmbedBuilder } = require("discord.js");
const { addUserAndGuildRelation } = require("../../database-interactions/users-and-guilds");
const { postGuild, getGuildById } = require("../../database-interactions/guilds");
const { postUser } = require("../../database-interactions/users");
const { container } = require("@sapphire/framework");
const formatCodeResponse = require("../../utils/format-code-response");

class DatabaseCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: ["OwnerOnly"],
            subcommands: [
                {
                    name: "query",
                    chatInputRun: "chatInputQuery"
                },
                {
                    name: "add-user",
                    chatInputRun: "chatInputAddUser"
                },
                {
                    name: "add-guild",
                    chatInputRun: "chatInputAddGuild"
                },
                {
                    name: "add-user-to-guild",
                    chatInputRun: "chatInputAddUserToGuild"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("database")
            .setDescription("Commands to interact with the bot's database")
            .addSubcommand((command) => {
                return command
                .setName("query")
                .setDescription("Directly query the bot's database")
                .addStringOption((option) => {
                    return option
                    .setName("query")
                    .setDescription("The SQL query")
                    .setRequired(true)
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("add-user")
                .setDescription("Add a user to the bot's database")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to add to the bot's database")
                    .setRequired(true)
                })
            })
            .addSubcommand((command) => {
                return command
                .setName("add-guild")
                .setDescription("Add the current guild to the bot's database")
            })
            .addSubcommand((command) => {
                return command
                .setName("add-user-to-guild")
                .setDescription("Add the user to the guild the command is run in")
                .addUserOption((option) => {
                    return option
                    .setName("user")
                    .setDescription("The user to add to the guild")
                })
            })
        })
    }

    async chatInputQuery(interaction){
        const queryString = interaction.options.getString("query")
        const {queryResult, success} = await runQuery(queryString)

        const message = formatCodeResponse(
            ["Query executed", "Error while executing query"],
            ["Query", queryString],
            ["Result", queryResult],
            success
        )
        
        await interaction.reply(message)

        function runQuery(queryString){
            const {database} = container
            return database.$queryRawUnsafe(queryString).then((queryResult) => {
                return {queryResult, success: true}
            }).catch((err) => {
                return {queryResult: err, success: false}
            })
        }
    }

    async chatInputAddUser(interaction){
        const user = interaction.options.getUser("user")
        const {joinedAt} = interaction.options.getMember("user")
        
        try {
            const guild = await getGuildById(interaction.guild.id)
            if(!guild){
                await postGuild(interaction.guild)
            }
            const userInDb = await postUser(user, interaction.guild, joinedAt)
            const embed = new EmbedBuilder()
                .setTitle("User added")
                .setAuthor({name: userInDb.username})
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    {name: "user_id", value: userInDb.user_id},
                    {name: "username", value: userInDb.username},
                    {name: "global_name", value: userInDb.global_name},
                    {name: "bot_user", value: `${user.bot}`}
                )

            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }

    async chatInputAddGuild(interaction){
        try {
            const guildInDb = await postGuild(interaction.guild)
            const embed = new EmbedBuilder()
                .setTitle("Guild added")
                .setAuthor({name: interaction.user.globalName})
                .addFields(
                    {name: "id", value: guildInDb.guild_id},
                    {name: "name", value: guildInDb.name}
                )
            
            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }

    async chatInputAddUserToGuild(interaction){
        const user = interaction.options.getUser("user") ?? interaction.user
        const {joinedAt} = interaction.options.getMember("user") ?? interaction.member

        try {
            const relation = await addUserAndGuildRelation(user.id, interaction.guild.id, joinedAt)

            await interaction.reply("```js\n" + JSON.stringify(relation, null, 2) + "```")
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }
}

module.exports = {DatabaseCommand}