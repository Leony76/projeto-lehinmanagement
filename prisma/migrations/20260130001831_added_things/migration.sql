/*
  Warnings:

  - You are about to drop the column `deleted_by` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "deleted_by",
ADD COLUMN     "deletedByCustomerAt" TIMESTAMP(3),
ADD COLUMN     "deletedBySellerAt" TIMESTAMP(3);
