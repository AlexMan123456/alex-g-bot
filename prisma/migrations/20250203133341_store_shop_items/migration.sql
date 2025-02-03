-- CreateTable
CREATE TABLE "items" (
    "item_id" SERIAL NOT NULL,
    "user_id" TEXT,
    "guild_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "stock" INTEGER,
    "price" INTEGER NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("item_id")
);

-- CreateTable
CREATE TABLE "UsersAndItems" (
    "user_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "UsersAndItems_pkey" PRIMARY KEY ("user_id","item_id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_guild_id_fkey" FOREIGN KEY ("guild_id") REFERENCES "guilds"("guild_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersAndItems" ADD CONSTRAINT "UsersAndItems_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersAndItems" ADD CONSTRAINT "UsersAndItems_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;
