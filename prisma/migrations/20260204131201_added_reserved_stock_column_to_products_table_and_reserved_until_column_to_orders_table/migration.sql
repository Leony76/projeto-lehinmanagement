-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "reservedUntil" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "reservedStock" INTEGER NOT NULL DEFAULT 0;
