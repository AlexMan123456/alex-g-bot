/*
  Warnings:

  - The primary key for the `command_cooldowns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `command_id` column on the `command_cooldowns` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "command_cooldowns" DROP CONSTRAINT "command_cooldowns_pkey",
DROP COLUMN "command_id",
ADD COLUMN     "command_id" SERIAL NOT NULL,
ADD CONSTRAINT "command_cooldowns_pkey" PRIMARY KEY ("command_id");
