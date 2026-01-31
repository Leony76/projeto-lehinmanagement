/*
  Warnings:

  - You are about to drop the `CostumerProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CostumerProduct" DROP CONSTRAINT "CostumerProduct_costumer_id_fkey";

-- DropForeignKey
ALTER TABLE "CostumerProduct" DROP CONSTRAINT "CostumerProduct_costumer_product_id_fkey";

-- DropTable
DROP TABLE "CostumerProduct";

-- CreateTable
CREATE TABLE "costumer_products" (
    "id" SERIAL NOT NULL,
    "costumer_id" TEXT NOT NULL,
    "costumer_product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "costumer_products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "costumer_products" ADD CONSTRAINT "costumer_products_costumer_id_fkey" FOREIGN KEY ("costumer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "costumer_products" ADD CONSTRAINT "costumer_products_costumer_product_id_fkey" FOREIGN KEY ("costumer_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
