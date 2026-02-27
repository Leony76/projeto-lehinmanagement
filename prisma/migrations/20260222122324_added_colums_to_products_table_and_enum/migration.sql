/*
  Warnings:

  - You are about to drop the column `is_active` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'REMOVED', 'DELETED');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "is_active",
ADD COLUMN     "removed_at" TIMESTAMP(3),
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE';
