/*
  Warnings:

  - You are about to drop the `support_messages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_receiver_id_fkey";

-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_replier_id_fkey";

-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_user_id_fkey";

-- DropTable
DROP TABLE "support_messages";
