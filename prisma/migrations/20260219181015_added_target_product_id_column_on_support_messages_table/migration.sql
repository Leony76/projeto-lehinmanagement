/*
  Warnings:

  - You are about to drop the column `messageAfterReactivated` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "support_messages" ADD COLUMN     "target_product_id" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "messageAfterReactivated",
ADD COLUMN     "message_after_reactivated" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_target_product_id_fkey" FOREIGN KEY ("target_product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
