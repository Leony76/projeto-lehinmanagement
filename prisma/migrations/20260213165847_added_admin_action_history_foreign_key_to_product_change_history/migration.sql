/*
  Warnings:

  - You are about to drop the column `admin_id` on the `product_changes_history` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `product_changes_history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[admin_action_id]` on the table `product_changes_history` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `adminId` to the `product_changes_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admin_action_id` to the `product_changes_history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `product_changes_history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_changes_history" DROP CONSTRAINT "product_changes_history_admin_id_fkey";

-- DropForeignKey
ALTER TABLE "product_changes_history" DROP CONSTRAINT "product_changes_history_product_id_fkey";

-- AlterTable
ALTER TABLE "product_changes_history" DROP COLUMN "admin_id",
DROP COLUMN "product_id",
ADD COLUMN     "adminId" TEXT NOT NULL,
ADD COLUMN     "admin_action_id" INTEGER NOT NULL,
ADD COLUMN     "productId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_changes_history_admin_action_id_key" ON "product_changes_history"("admin_action_id");

-- AddForeignKey
ALTER TABLE "product_changes_history" ADD CONSTRAINT "product_changes_history_admin_action_id_fkey" FOREIGN KEY ("admin_action_id") REFERENCES "admin_action_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_changes_history" ADD CONSTRAINT "product_changes_history_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_changes_history" ADD CONSTRAINT "product_changes_history_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
