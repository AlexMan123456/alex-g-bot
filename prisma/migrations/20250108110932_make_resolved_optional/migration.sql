-- AlterTable
ALTER TABLE "suggestions" ALTER COLUMN "resolved" DROP NOT NULL,
ALTER COLUMN "resolved" DROP DEFAULT;
