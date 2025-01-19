const { stripIndents } = require("common-tags")

function formatCodeResponse([titleSuccess, titleError], [inputLabel, inputResult], [outputLabel, outputResult], success){
    let finalMessage = stripIndents(
        `**${success ? titleSuccess : titleError}**
        __${inputLabel}__
        ${"```" + inputResult + "```"}
        __${success ? outputLabel : "Error Message"}__`
    )

    finalMessage = finalMessage + "\n```js\n" + JSON.stringify(outputResult, null, 2) + "```"

    if(finalMessage.length > 2000){
        finalMessage = finalMessage.slice(0,1994) + "...```"
    }

    return finalMessage
}

module.exports = formatCodeResponse