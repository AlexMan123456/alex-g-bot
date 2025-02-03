const { InteractionHandler, InteractionHandlerTypes } = require("@sapphire/framework");
const { default: Type } = require("@sapphire/type");
const { EmbedBuilder } = require("discord.js");

class EvalModalHandler extends InteractionHandler {
    constructor(context, options) {
        super(context, {
          ...options,
          interactionHandlerType: InteractionHandlerTypes.ModalSubmit
        });
    }

    parse(interaction){
        if(interaction.customId !== 'Eval'){
            return this.none()
        }
        return this.some();
    }

    async run(interaction){
        const code = interaction.fields.getTextInputValue("code")
        const lineSpacing = interaction.fields.getTextInputValue("lineSpacing")
        const {evaluatedCode, colour} = evaluateCode(code)

        try {
            const displayedOutput = colour === "Red" ? `${evaluatedCode}` : JSON.stringify(evaluatedCode, null, parseInt(lineSpacing))
    
            const embed = new EmbedBuilder()
                .setTitle("Eval")
                .setAuthor({name: interaction.user.username})
                .addFields(
                    {name: "Input", value: "```js\n" + code + "```"},
                    {name: "Output", value: "```" + (colour === "Red" ? "" : "js\n") + displayedOutput + "```"}
                )
                .setColor(colour)
                .setFooter({text: `Output type: ${new Type(evaluatedCode).toString()}`})

            await interaction.reply({embeds: [embed]})
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }
}

function evaluateCode(code){
    try {
        return {evaluatedCode: eval(code), colour: "Green"}
    } catch(err) {
        return {evaluatedCode: err, colour: "Red"}
    }
}

module.exports = {EvalModalHandler}