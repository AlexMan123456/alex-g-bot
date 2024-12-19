-- CreateTable
CREATE TABLE "users" (
    "user_id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "global_name" VARCHAR(100) NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "bot_user" BOOLEAN NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);
