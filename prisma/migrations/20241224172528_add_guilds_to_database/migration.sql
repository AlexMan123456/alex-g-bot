-- CreateTable
CREATE TABLE "guilds" (
    "guild_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("guild_id")
);

-- CreateTable
CREATE TABLE "users_and_guilds" (
    "user_id" TEXT NOT NULL,
    "guild_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_and_guilds_pkey" PRIMARY KEY ("user_id","guild_id")
);

-- AddForeignKey
ALTER TABLE "users_and_guilds" ADD CONSTRAINT "users_and_guilds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_and_guilds" ADD CONSTRAINT "users_and_guilds_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE CASCADE ON UPDATE CASCADE;
