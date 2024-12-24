const { container } = require("@sapphire/framework")
const { EmbedBuilder } = require("discord.js")

async function queryDatabase(interaction){
    const queryString = interaction.options.getString("query")
        const {queryResult, colour} = await runQuery(queryString)

        const embed = new EmbedBuilder()
            .setTitle(colour === "Green" ? "Query executed" : "Error while executing query")
            .setAuthor({name: interaction.user.username})
            .addFields(
                {name: "Input", value: "```" + queryString + "```"},
                {name: "Output", value: "```js\n" + JSON.stringify(queryResult, undefined, 2) + "```"}
            )
            .setColor(colour)
        
        await interaction.reply({embeds: [embed]})
}

function runQuery(queryString){
    const {database} = container
    return database.$queryRawUnsafe(queryString).then((queryResult) => {
        return {queryResult, colour: "Green"}
    }).catch((err) => {
        return {queryResult: err, colour: "Red"}
    })
}

module.exports = queryDatabase