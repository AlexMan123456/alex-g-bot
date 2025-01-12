/*
  Warnings:

  - Added the required column `name` to the `command_cooldowns` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "command_cooldowns" ADD COLUMN     "name" TEXT NOT NULL;
