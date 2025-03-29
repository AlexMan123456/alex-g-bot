const { Command } = require('@sapphire/framework');
const logError = require('../../utils/log-error');
const { patchUser, getUserById } = require('../../database-interactions/users');
const createMonthOptions = require('../../utils/create-month-choices');
const { isNullish } = require('@sapphire/utilities');

class BirthdayCommand extends Command {
	constructor(context, options) {
		super(context, { ...options });
	}

	/**
	 * @param {import('@sapphire/framework').Command.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((command) => {
			return command
				.setName('add-birthday')
				.setDescription('Tell the bot your birthday')
				.addNumberOption((option) => {
					return option
						.setName('day')
						.setDescription('The day of the month of your birthday')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(12)
						.setChoices(...createMonthOptions());
				})
				.addNumberOption((option) => {
					return option.setName('month').setDescription('The month of your birthday').setRequired(true);
				});
		});
	}

	async chatInputRun(interaction) {
		const month = interaction.options.getNumber('month');
		const day = interaction.options.getNumber('day');

		const user = getUserById(interaction.user.id);

		if (isNullish(user.date_of_birth)) {
			return await interaction.reply({ content: `Can not change birthday if one is already set`, ephemeral: true });
		}

		try {
			if (day > 30 && [4, 6, 9, 11].includes(month)) {
				return await interaction.reply({ content: `Day out of bounds for a birthday in ${this.#getMonthByNumber(month)}`, ephemeral: true });
			}
			if (day > 29 && month === 2) {
				return await interaction.reply({ content: 'Day out of bounds for a birthday in February', ephemeral: true });
			}
			if (day > 31 && [1, 3, 5, 7, 8, 10, 12].includes(month)) {
				return await interaction.reply({ content: `Date out of bounds for a birthday in ${this.#getMonthByNumber(month)}`, ephemeral: true });
			}

			const birthday = new Date();
			birthday.setMonth(month - 1);
			birthday.setDate(day);

			const { date_of_birth } = await patchUser(interaction.user.id, {
				date_of_birth: birthday
			});

			await interaction.reply(
				`Date of birth for <@${interaction.user.id}> set to ${this.#getMonthByNumber(date_of_birth.getMonth() + 1)} ${date_of_birth.getDate()}`
			);
		} catch (error) {
			await interaction.reply({ content: 'Error setting your birthday. Please try again later.', ephemeral: true });
			await logError(interaction, error);
		}
	}

	#getMonthByNumber(month) {
		return ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month];
	}
}

module.exports = { BirthdayCommand };
