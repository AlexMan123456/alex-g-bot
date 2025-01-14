const { Subcommand } = require("@sapphire/plugin-subcommands")
const axios = require("axios")
const { EmbedBuilder } = require("discord.js")
const logError = require("../../utils/log-error")
const { stripIndents } = require("common-tags")

class ApiCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options,
            preconditions: ["OwnerOnly"],
            subcommands: [
                {
                    name: "get",
                    chatInputRun: "chatInputGet"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("api")
            .setDescription("Make an API request")
            .addSubcommand((command) => {
                return command
                .setName("get")
                .setDescription("Send a GET request to an API")
                .addStringOption((option) => {
                    return option
                    .setName("api")
                    .setDescription("The link to the API")
                    .setRequired(true)
                })
            })
        })
    }

    async chatInputRun(interaction){
        const apiLink = interaction.options.getString("api")

        const {data, error} = await this.getFromApi(apiLink)

        let outputMessage = stripIndents(
            `**${error === false ? "API request successful" : "Error making API request"}**
            __Request__
            ${"```" + apiLink + "```"}
            __Response__`
        )

        outputMessage = outputMessage + "\n```js\n" + JSON.stringify(data, null, 2) + "```"

        if(outputMessage.length > 2000){
            outputMessage = outputMessage.slice(0,1994) + "...```"
        }
        /*const embed = new EmbedBuilder()
        .setTitle(colour === "Green" ? "API request successful" : "Error making API request")
        .setAuthor({name: interaction.user.globalName})
        .addFields(
            {name: "Request", value: "```" + apiLink + "```"},
            {name: "Response", value: "```js\n" + JSON.stringify(data, null, 2) + "```"}
        )
        .setColor(colour)*/

        await interaction.reply(outputMessage)
    }

    async getFromApi(apiLink){
        return axios.get(apiLink).then(({data}) => {
            return {data, error: false}
        }).catch((err) => {
            return {data: err, error: true}
        })
    }
}

module.exports = {ApiCommand}