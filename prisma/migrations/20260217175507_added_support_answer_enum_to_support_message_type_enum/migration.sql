/*
  Warnings:

  - You are about to drop the column `sentBy` on the `support_messages` table. All the data in the column will be lost.
  - Added the required column `sent_by` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "SupportMessageType" ADD VALUE 'SUPPORT_ANSWER';

-- AlterTable
ALTER TABLE "support_messages" DROP COLUMN "sentBy",
ADD COLUMN     "sent_by" "SupportMessageSentBy" NOT NULL;
