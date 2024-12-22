-- CreateTable
CREATE TABLE "suggestions" (
    "suggestion_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("suggestion_id")
);

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
