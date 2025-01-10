const { Listener } = require("@sapphire/framework");
const denyChatInputCommand = require("../../miscellaneous/event-listeners/deny-chat-input-command");

class UserEvent extends Listener {
    constructor(context, options){
        super(context, {
            ...options,
            event: "chatInputSubcommandDenied"
        })
    }
    
    async run(error, {interaction}){
        return await denyChatInputCommand(error, interaction)
    }
}

module.exports = {UserEvent}

