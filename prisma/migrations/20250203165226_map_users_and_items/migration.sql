/*
  Warnings:

  - You are about to drop the `UsersAndItems` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersAndItems" DROP CONSTRAINT "UsersAndItems_item_id_fkey";

-- DropForeignKey
ALTER TABLE "UsersAndItems" DROP CONSTRAINT "UsersAndItems_user_id_fkey";

-- DropTable
DROP TABLE "UsersAndItems";

-- CreateTable
CREATE TABLE "users_and_items" (
    "user_id" TEXT NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "users_and_items_pkey" PRIMARY KEY ("user_id","item_id")
);

-- AddForeignKey
ALTER TABLE "users_and_items" ADD CONSTRAINT "users_and_items_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "items"("item_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users_and_items" ADD CONSTRAINT "users_and_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
