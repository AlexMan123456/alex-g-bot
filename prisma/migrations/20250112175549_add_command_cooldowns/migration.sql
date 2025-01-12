-- CreateTable
CREATE TABLE "command_cooldowns" (
    "command_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "cooldown_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "command_cooldowns_pkey" PRIMARY KEY ("command_id")
);

-- AddForeignKey
ALTER TABLE "command_cooldowns" ADD CONSTRAINT "command_cooldowns_user_id_guild_id_fkey" FOREIGN KEY ("user_id", "guild_id") REFERENCES "users_and_guilds"("user_id", "guild_id") ON DELETE CASCADE ON UPDATE CASCADE;
