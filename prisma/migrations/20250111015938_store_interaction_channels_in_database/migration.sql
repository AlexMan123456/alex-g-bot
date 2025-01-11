-- AlterTable
ALTER TABLE "guilds" ADD COLUMN     "error_log_channel_id" TEXT,
ADD COLUMN     "leave_channel_id" TEXT,
ADD COLUMN     "welcome_channel_id" TEXT;
