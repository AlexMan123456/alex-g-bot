/**
 *
 * @returns {import('discord.js').APIApplicationCommandOptionChoice<number>[]}
 */
function createMonthOptions() {
	return [
		{ name: 'January', value: 1 },
		{ name: 'Febuary', value: 2 },
		{ name: 'March', value: 3 },
		{ name: 'April', value: 4 },
		{ name: 'May', value: 5 },
		{ name: 'June', value: 6 },
		{ name: 'July', value: 7 },
		{ name: 'August', value: 8 },
		{ name: 'September', value: 9 },
		{ name: 'October', value: 10 },
		{ name: 'November', value: 11 },
		{ name: 'December', value: 12 }
	];
}

module.exports = createMonthOptions;
