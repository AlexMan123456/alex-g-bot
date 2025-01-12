/*
  Warnings:

  - You are about to drop the column `cooldown_until` on the `command_cooldowns` table. All the data in the column will be lost.
  - Added the required column `cooldown_expiry` to the `command_cooldowns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "command_cooldowns" DROP COLUMN "cooldown_until",
ADD COLUMN     "cooldown_expiry" TIMESTAMP(3) NOT NULL;
