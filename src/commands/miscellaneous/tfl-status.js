const { Command } = require("@sapphire/framework");
const axios = require("axios");
const { EmbedBuilder } = require("discord.js");

class TflCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
            .setName("tfl-status")
            .setDescription("Get status updates about TfL services.")
        })
    }

    async chatInputRun(interaction){
        const {data: tubeStatus} = await axios.get("https://api.tfl.gov.uk/line/mode/tube/status")

        const embed = new EmbedBuilder()
        .setTitle("TfL status")
        .addFields(
            {name: "Tube", value: tubeStatus.map((line) => {
                return `${line.lineStatuses[0].statusSeverityDescription === "Good Service" ? ":white_check_mark:" : ":x:"} ${line.name}: ${line.lineStatuses[0].statusSeverityDescription}`
            }).join("\n")}
        )

        await interaction.reply({embeds: [embed]})
    }
}

module.exports = {TflCommand}