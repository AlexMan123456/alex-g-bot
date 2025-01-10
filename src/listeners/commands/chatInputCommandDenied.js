const { Listener } = require("@sapphire/framework");

class UserEvent extends Listener {
    async run(error, {interaction}){
        if(interaction.deferred || interaction.replied){
            return await interaction.editReply({
                content: error.message
              })        
        }

        return await interaction.reply({
            content: error.message
        })
    }
}

module.exports = {UserEvent}