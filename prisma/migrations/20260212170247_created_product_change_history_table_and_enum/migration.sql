/*
  Warnings:

  - You are about to drop the column `remove_justify` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductAdminAction" AS ENUM ('EDITED', 'DELETED', 'BLOCKED', 'UNBLOCKED');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "remove_justify";

-- CreateTable
CREATE TABLE "ProductChangeHistory" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" "ProductAdminAction" NOT NULL,
    "justification" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductChangeHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductChangeHistory" ADD CONSTRAINT "ProductChangeHistory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductChangeHistory" ADD CONSTRAINT "ProductChangeHistory_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
