const { Command, container } = require("@sapphire/framework")
const { EmbedBuilder } = require("discord.js")

class QueryCommand extends Command {
    constructor(context, options){
        super(context, {...options, preconditions: ["OwnerOnly"]})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            builder
                .setName("query-database")
                .setDescription("(OWNER ONLY) Query the database using a raw SQL string")
                .addStringOption((option) => {
                    return option
                        .setName("query")
                        .setDescription("The query string")
                        .setRequired(true)
                })
        })
    }

    async chatInputRun(interaction){
        const queryString = interaction.options.getString("query")
        const {queryResult, colour} = await runQuery(queryString)

        const embed = new EmbedBuilder()
            .setTitle("Query executed")
            .setAuthor({name: interaction.user.username})
            .addFields(
                {name: "Input", value: "```" + queryString + "```"},
                {name: "Output", value: "```js\n" + JSON.stringify(queryResult, undefined, 2) + "```"}
            )
            .setColor(colour)
        
        await interaction.reply({embeds: [embed]})
    }
}

function runQuery(queryString){
    const {database} = container
    return database.$queryRawUnsafe(queryString).then((queryResult) => {
        return {queryResult, colour: "Green"}
    }).catch((err) => {
        return {queryResult: err, colour: "Red"}
    })
}

module.exports = {QueryCommand}