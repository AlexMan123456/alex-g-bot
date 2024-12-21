const { PrismaClient } = require("@prisma/client");
const { Listener } = require("@sapphire/framework");

class UserEvent extends Listener {
    constructor(context, options) {
        super(context, {
          ...options,
          event: "GUILD_MEMBER_ADD"
        });
      }

    async run(member){
        this.addToDatabase(member)
    }

    async addToDatabase(member){
        
    }
}