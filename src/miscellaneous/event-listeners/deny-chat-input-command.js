async function denyChatInputCommand(error, interaction){
    const reply = {
        content: error.message
    }
    if(error.context){
        if(error.context.ephemeral){
            reply.ephemeral = error.context.ephemeral
        }
    }

    if(error.identifier === "preconditionCooldown"){
        reply.ephemeral = true
    }

    if(interaction.deferred || interaction.replied){
        return await interaction.editReply(reply)        
    }
    return await interaction.reply(reply)
}

module.exports = denyChatInputCommand