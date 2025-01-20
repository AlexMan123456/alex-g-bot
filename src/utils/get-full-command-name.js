function getFullCommandName(interaction){
    return `${interaction.command.name}${interaction.options._subcommand ? " " + interaction.options._subcommand : ""}`
}

module.exports = getFullCommandName