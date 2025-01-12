function getFullCommandName(command, subcommand){
    return `${command}${subcommand ? " " + subcommand : ""}`
}

module.exports = getFullCommandName