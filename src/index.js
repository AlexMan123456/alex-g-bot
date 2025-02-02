require('./lib/setup');
const { PrismaClient } = require('@prisma/client');
const { LogLevel, SapphireClient, container } = require('@sapphire/framework');
const { GatewayIntentBits, Partials } = require('discord.js');

const client = new SapphireClient({
	defaultPrefix: process.env.PREFIX,
	regexPrefix: /^(hey +)?bot[,! ]/i,
	caseInsensitiveCommands: true,
	logger: {
		level: LogLevel.Debug
	},
	shards: 'auto',
	intents: [
		GatewayIntentBits.DirectMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildEmojisAndStickers,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		container.database = new PrismaClient();
		container.startTime = new Date();
		await client.login(process.env.DISCORD_TOKEN);
		client.logger.info('logged in');
	} catch (error) {
		client.logger.fatal(error);
		container.database.destroy();
		container.startTime.destroy();
		client.destroy();
		process.exit(1);
	}
};

main();
