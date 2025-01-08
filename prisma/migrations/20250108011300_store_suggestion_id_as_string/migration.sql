/*
  Warnings:

  - The primary key for the `suggestions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "suggestions" DROP CONSTRAINT "suggestions_pkey",
ALTER COLUMN "suggestion_id" DROP DEFAULT,
ALTER COLUMN "suggestion_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "suggestions_pkey" PRIMARY KEY ("suggestion_id");
DROP SEQUENCE "suggestions_suggestion_id_seq";
