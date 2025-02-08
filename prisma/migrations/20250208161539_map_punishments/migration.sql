/*
  Warnings:

  - You are about to drop the `Punishments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Punishments" DROP CONSTRAINT "Punishments_guild_id_fkey";

-- DropForeignKey
ALTER TABLE "Punishments" DROP CONSTRAINT "Punishments_user_id_fkey";

-- DropTable
DROP TABLE "Punishments";

-- CreateTable
CREATE TABLE "punishments" (
    "punishment_id" SERIAL NOT NULL,
    "type" "PunishmentType" NOT NULL,
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "reason" TEXT,

    CONSTRAINT "punishments_pkey" PRIMARY KEY ("punishment_id")
);

-- AddForeignKey
ALTER TABLE "punishments" ADD CONSTRAINT "punishments_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "punishments" ADD CONSTRAINT "punishments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
