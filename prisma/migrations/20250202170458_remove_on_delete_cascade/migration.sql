-- DropForeignKey
ALTER TABLE "users_and_guilds" DROP CONSTRAINT "users_and_guilds_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "users_and_guilds" DROP CONSTRAINT "users_and_guilds_user_id_fkey";

-- AddForeignKey
ALTER TABLE "users_and_guilds" ADD CONSTRAINT "users_and_guilds_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_and_guilds" ADD CONSTRAINT "users_and_guilds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
