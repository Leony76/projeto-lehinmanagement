/*
  Warnings:

  - Added the required column `sentBy` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SupportMessageSentBy" AS ENUM ('SUPPORT', 'USER');

-- AlterEnum
ALTER TYPE "AdminAction" ADD VALUE 'MESSAGE_TO_USER';

-- AlterTable
ALTER TABLE "support_messages" ADD COLUMN     "sentBy" "SupportMessageSentBy" NOT NULL;
