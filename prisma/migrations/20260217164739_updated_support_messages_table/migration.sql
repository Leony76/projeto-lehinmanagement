/*
  Warnings:

  - Added the required column `receiver_id` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "support_messages" ADD COLUMN     "receiver_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
