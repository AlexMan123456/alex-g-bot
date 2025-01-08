/*
  Warnings:

  - You are about to drop the column `resolved` on the `suggestions` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('pending', 'resolved', 'rejected');

-- AlterTable
ALTER TABLE "suggestions" DROP COLUMN "resolved",
ADD COLUMN     "status" "SuggestionStatus" NOT NULL DEFAULT 'pending';
