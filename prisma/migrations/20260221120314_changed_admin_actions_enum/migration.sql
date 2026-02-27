/*
  Warnings:

  - The values [EDITED,DELETED,BLOCKED,UNBLOCKED] on the enum `AdminAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminAction_new" AS ENUM ('USER_DEACTIVATED', 'USER_ACTIVATED', 'PRODUCT_REMOVED', 'PRODUCT_EDITED', 'PRODUCT_REACTIVATED', 'ORDER_CANCELED', 'PAYMENT_REFUNDED', 'MESSAGE_REPLY', 'MESSAGE_TO_USER');
ALTER TABLE "admin_action_history" ALTER COLUMN "action" TYPE "AdminAction_new" USING ("action"::text::"AdminAction_new");
ALTER TYPE "AdminAction" RENAME TO "AdminAction_old";
ALTER TYPE "AdminAction_new" RENAME TO "AdminAction";
DROP TYPE "public"."AdminAction_old";
COMMIT;
