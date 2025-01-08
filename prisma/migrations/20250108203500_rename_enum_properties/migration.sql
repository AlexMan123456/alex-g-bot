/*
  Warnings:

  - The values [pending,resolved,rejected] on the enum `SuggestionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SuggestionStatus_new" AS ENUM ('Pending', 'Resolved', 'Rejected');
ALTER TABLE "suggestions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "suggestions" ALTER COLUMN "status" TYPE "SuggestionStatus_new" USING ("status"::text::"SuggestionStatus_new");
ALTER TYPE "SuggestionStatus" RENAME TO "SuggestionStatus_old";
ALTER TYPE "SuggestionStatus_new" RENAME TO "SuggestionStatus";
DROP TYPE "SuggestionStatus_old";
ALTER TABLE "suggestions" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;
