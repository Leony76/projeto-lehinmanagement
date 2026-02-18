/*
  Warnings:

  - You are about to drop the column `user_id` on the `support_messages` table. All the data in the column will be lost.
  - Added the required column `sender_id` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_user_id_fkey";

-- AlterTable
ALTER TABLE "support_messages" DROP COLUMN "user_id",
ADD COLUMN     "sender_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
