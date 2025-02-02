-- DropForeignKey
ALTER TABLE "command_cooldowns" DROP CONSTRAINT "command_cooldowns_user_id_guild_id_fkey";

-- AddForeignKey
ALTER TABLE "command_cooldowns" ADD CONSTRAINT "command_cooldowns_user_id_guild_id_fkey" FOREIGN KEY ("user_id", "guild_id") REFERENCES "users_and_guilds"("user_id", "guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
