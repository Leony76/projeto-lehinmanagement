/*
  Warnings:

  - Added the required column `order_id` to the `costumer_products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "costumer_products" ADD COLUMN     "order_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "costumer_products" ADD CONSTRAINT "costumer_products_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
