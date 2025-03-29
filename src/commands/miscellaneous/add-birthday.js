const { Command } = require("@sapphire/framework");
const logError = require("../../utils/log-error");
const { patchUser } = require("../../database-interactions/users");

class BirthdayCommand extends Command {
    constructor(context, options){
        super(context, {...options})
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((command) => {
            return command
            .setName("add-birthday")
            .setDescription("Tell the bot your birthday")
            .addNumberOption((option) => {
                return option
                .setName("day")
                .setDescription("The day of the month of your birthday")
                .setRequired(true)
            })
            .addNumberOption((option) => {
                return option
                .setName("month")
                .setDescription("The month of your birthday")
                .setRequired(true)
            })
        })
    }

    async chatInputRun(interaction){
        const month = interaction.options.getNumber("month");
        const day = interaction.options.getNumber("day");

        try {
            if(month > 12 || month < 1){
                return await interaction.reply({message: "Month must be between 1 and 12.", ephemeral: true})
            }
            if(day < 1){
                return await interaction.reply({message: "Date cannot be non-positive", ephemeral: true})
            }
            if(day > 30 && [4, 6, 9, 11].includes(month)){
                return await interaction.reply({message: `Day out of bounds for a birthday in ${this.#getMonthByNumber(month)}`, ephemeral: true});
            }
            if(day > 29 && month === 2){
                return await interaction.reply({message: "Day out of bounds for a birthday in February", ephemeral: true})
            }
            if(day > 31 && [1, 3, 5, 7, 8, 10, 12].includes(month)){
                return await interaction.reply({message: `Date out of bounds for a birthday in ${this.#getMonthByNumber(month)}`, ephemeral: true})
            }

            const birthday = new Date();
            birthday.setMonth(month-1);
            birthday.setDate(day);
            
            const {date_of_birth} = await patchUser(interaction.user.id, {
                date_of_birth: birthday
            })

            await interaction.reply(`Date of birth for <@${interaction.user.id}> set to ${this.#getMonthByNumber(date_of_birth.getMonth()+1)} ${date_of_birth.getDate()}`)
        } catch(error) {
            await interaction.reply({message: "Error setting your birthday. Please try again later.", ephemeral: true})
            await logError(interaction, error)
        }
    }

    #getMonthByNumber(month){
        return [
            "",
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ][month]
    }
}

module.exports = {BirthdayCommand}