/*
  Warnings:

  - You are about to drop the column `error_log_channel_id` on the `guilds` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "guilds" DROP COLUMN "error_log_channel_id",
ADD COLUMN     "error_log_id" TEXT;
