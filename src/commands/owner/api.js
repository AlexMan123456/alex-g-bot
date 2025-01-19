const { Subcommand } = require("@sapphire/plugin-subcommands")
const axios = require("axios")
const { EmbedBuilder } = require("discord.js")
const logError = require("../../utils/log-error")
const { stripIndents } = require("common-tags")
const formatCodeResponse = require("../../utils/format-code-response")

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
        const {data, success} = await this.getFromApi(apiLink)

        const outputMessage = formatCodeResponse(
            ["API request successful", "Error making API request"],
            ["Request", apiLink],
            ["Response", data],
            success
        )

        await interaction.reply(outputMessage)
    }

    async getFromApi(apiLink){
        return axios.get(apiLink).then(({data}) => {
            return {data, success: true}
        }).catch((err) => {
            return {data: err, success: false}
        })
    }
}

module.exports = {ApiCommand}