-- AlterTable
ALTER TABLE "guilds" ALTER COLUMN "leave_message" SET DEFAULT '{user} has left {guild}',
ALTER COLUMN "welcome_message" SET DEFAULT '{user} has joined {guild}';
