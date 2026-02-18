/*
  Warnings:

  - Added the required column `userSituation` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "support_messages" ADD COLUMN     "userSituation" "UserSituation" NOT NULL;
