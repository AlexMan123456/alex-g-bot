const { AllFlowsPrecondition } = require('@sapphire/framework');

const message = 'This command can only be used by the owner.';
class UserPrecondition extends AllFlowsPrecondition {
	/**
	 * @param {import('discord.js').CommandInteraction} interaction
	 */
	chatInputRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').ContextMenuCommandInteraction} interaction
	 */
	contextMenuRun(interaction) {
		return this.doOwnerCheck(interaction.user.id);
	}

	/**
	 * @param {import('discord.js').Message} message
	 */
	messageRun(message) {
		return this.doOwnerCheck(message.author.id);
	}

	/**
	 * @param {import('discord.js').Snowflake} userId
	 */
	doOwnerCheck(userId) {
		return process.env.OWNER_ID === userId ? this.ok() : this.error({ message });
	}
}

module.exports = {
	UserPrecondition
};
