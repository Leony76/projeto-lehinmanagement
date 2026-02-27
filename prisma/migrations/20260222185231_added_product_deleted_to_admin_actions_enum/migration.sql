/*
  Warnings:

  - The values [ORDER_CANCELED,PAYMENT_REFUNDED] on the enum `AdminAction` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `reservedStock` on the `products` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminAction_new" AS ENUM ('USER_DEACTIVATED', 'USER_ACTIVATED', 'PRODUCT_REMOVED', 'PRODUCT_EDITED', 'PRODUCT_DELETED', 'PRODUCT_REACTIVATED', 'MESSAGE_REPLY', 'MESSAGE_TO_USER');
ALTER TABLE "admin_action_history" ALTER COLUMN "action" TYPE "AdminAction_new" USING ("action"::text::"AdminAction_new");
ALTER TYPE "AdminAction" RENAME TO "AdminAction_old";
ALTER TYPE "AdminAction_new" RENAME TO "AdminAction";
DROP TYPE "public"."AdminAction_old";
COMMIT;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "reservedStock",
ADD COLUMN     "reserved_stock" INTEGER NOT NULL DEFAULT 0;
