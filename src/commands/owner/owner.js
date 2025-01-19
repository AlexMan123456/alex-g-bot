const { Subcommand } = require("@sapphire/plugin-subcommands");
const queryDatabase = require("../../miscellaneous/owner-subcommands/query-database");
const evalCommand = require("../../miscellaneous/owner-subcommands/eval");
const addUserToDatabase = require("../../miscellaneous/owner-subcommands/add-user-to-db");
const addGuildToDatabase = require("../../miscellaneous/owner-subcommands/add-guild-to-db");
const addUserToGuild = require("../../miscellaneous/owner-subcommands/add-user-to-guild");
const { patchGuild } = require("../../database-interactions/guilds");
const logError = require("../../utils/log-error");

class OwnerCommand extends Subcommand {
    constructor(context, options){
        super(context, {
            ...options, 
            name: "owner",
            preconditions: ["OwnerOnly"],
            subcommands: [
                {
                    name: "test",
                    chatInputRun: "chatInputTest",
                    default: true
                },
                {
                    name: "eval",
                    chatInputRun: "chatInputEval"
                },
                {
                    name: "set-mod-role",
                    chatInputRun: "chatInputSetModRole"
                }
            ]
        })
    }

    registerApplicationCommands(registry){
        registry.registerChatInputCommand((builder) => {
            return builder
                .setName("owner")
                .setDescription("Commands only the owner can run")
                .addSubcommand((command) => {
                    return command
                        .setName("test")
                        .setDescription("Show a secret message if run by owner")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("eval")
                        .setDescription("Evaluates some JavaScript code")
                })
                .addSubcommand((command) => {
                    return command
                        .setName("set-mod-role")
                        .setDescription("Set the mod role of your server")
                        .addRoleOption((option) => {
                            return option
                                .setName("role")
                                .setDescription("The role to set as a mod role")
                                .setRequired(true)
                        })
                })
        })
    }

    async chatInputTest(interaction){
        try {
            await interaction.reply(`${interaction.user.username} is the best user`)
        } catch(err) {
            await interaction.reply({content: `${err}`, ephemeral: true})
        }
    }

    async chatInputQueryDatabase(interaction){
        await queryDatabase(interaction)
    }

    async chatInputEval(interaction){
        await evalCommand(interaction)
    }

    async chatInputAddUserToDatabase(interaction){
        await addUserToDatabase(interaction)
    }

    async chatInputAddGuildToDatabase(interaction){
        await addGuildToDatabase(interaction)
    }

    async chatInputAddUserToGuild(interaction){
        await addUserToGuild(interaction)
    }

    async chatInputSetModRole(interaction){
        const {id: mod_role_id} = interaction.options.getRole("role")
        
        try {
            await patchGuild(interaction.guild.id, {mod_role_id})
            await interaction.reply(`Mod role set to <@&${mod_role_id}>.`)
        } catch(err) {
            await interaction.reply("Could not set mod role.")
            await logError(interaction, err)
        }
    }
}

module.exports = {OwnerCommand}