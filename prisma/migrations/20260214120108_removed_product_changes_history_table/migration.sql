/*
  Warnings:

  - You are about to drop the `product_changes_history` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `justification` to the `admin_action_history` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "AdminAction" ADD VALUE 'EDITED';
ALTER TYPE "AdminAction" ADD VALUE 'DELETED';
ALTER TYPE "AdminAction" ADD VALUE 'BLOCKED';
ALTER TYPE "AdminAction" ADD VALUE 'UNBLOCKED';

-- DropForeignKey
ALTER TABLE "product_changes_history" DROP CONSTRAINT "product_changes_history_adminId_fkey";

-- DropForeignKey
ALTER TABLE "product_changes_history" DROP CONSTRAINT "product_changes_history_admin_action_id_fkey";

-- DropForeignKey
ALTER TABLE "product_changes_history" DROP CONSTRAINT "product_changes_history_productId_fkey";

-- AlterTable
ALTER TABLE "admin_action_history" ADD COLUMN     "justification" TEXT NOT NULL;

-- DropTable
DROP TABLE "product_changes_history";

-- DropEnum
DROP TYPE "ProductAdminAction";
