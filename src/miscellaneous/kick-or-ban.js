const { EmbedBuilder } = require("discord.js");
const DMUser = require("../utils/dm-user");
const { PunishmentType } = require("@prisma/client");
const logError = require("../utils/log-error");
const { postPunishment } = require("../database-interactions/punishments");

async function kickOrBan(interaction, type){
    try {
        const userToPunish = interaction.options.getMember("user");
        const reason = interaction.options.getString("reason");
        
        const punishmentData = {user_id: userToPunish.id, guild_id: interaction.guild.id, type};
        if(reason){
            punishmentData.reason = reason;
        }

        await postPunishment(punishmentData);

        const embed = new EmbedBuilder()
        .setTitle(`You have been ${type === PunishmentType.kick ? "kicked" : "banned"} from _${interaction.guild.name}_ by ${interaction.user.globalName}`)
        .setColor("Red")
        .addFields({name: "Reason", value: reason ?? "Unspecified"});

        await DMUser(userToPunish, {embeds: [embed]});
        type === PunishmentType.kick ? userToPunish.kick(reason) : userToPunish.ban({reason});
        
        embed.setTitle(`${userToPunish.user.username} ${type === PunishmentType.kick ? "kicked" : "banned"} successfully`)
        .setAuthor({name: interaction.user.globalName})
        .setColor("Green")

        await interaction.reply({embeds: [embed]});
    } catch(err) {
        await interaction.reply({content: `Error ${type === PunishmentType.kick ? "kicking" : "banning"} user`, ephemeral: true});
        await logError(interaction, err);
    }
}

module.exports = kickOrBan