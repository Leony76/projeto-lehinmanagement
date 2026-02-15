/*
  Warnings:

  - You are about to drop the column `userSituation` on the `support_messages` table. All the data in the column will be lost.
  - Added the required column `message` to the `support_messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_situation` to the `support_messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "support_messages" DROP COLUMN "userSituation",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "user_situation" "UserSituation" NOT NULL,
ALTER COLUMN "subject" DROP NOT NULL;
