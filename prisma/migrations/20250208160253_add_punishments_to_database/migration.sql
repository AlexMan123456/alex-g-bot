-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('warn', 'kick', 'ban');

-- CreateTable
CREATE TABLE "Punishments" (
    "punishment_id" SERIAL NOT NULL,
    "type" "PunishmentType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "Punishments_pkey" PRIMARY KEY ("punishment_id")
);

-- AddForeignKey
ALTER TABLE "Punishments" ADD CONSTRAINT "Punishments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Punishments" ADD CONSTRAINT "Punishments_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;
