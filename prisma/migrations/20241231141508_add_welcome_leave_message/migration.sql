-- AlterTable
ALTER TABLE "guilds" ADD COLUMN     "leave_message" TEXT NOT NULL DEFAULT '{user} has left the server',
ADD COLUMN     "welcome_message" TEXT NOT NULL DEFAULT '{user} has joined the server';
