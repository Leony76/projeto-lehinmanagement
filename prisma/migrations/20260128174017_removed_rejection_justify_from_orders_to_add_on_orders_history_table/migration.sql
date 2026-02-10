/*
  Warnings:

  - You are about to drop the column `rejection_justify` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_history" ADD COLUMN     "rejection_justify" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "rejection_justify";
