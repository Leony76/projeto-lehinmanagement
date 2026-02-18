-- CreateEnum
CREATE TYPE "UserSituation" AS ENUM ('ACTIVATED', 'DEACTIVATED');

-- CreateEnum
CREATE TYPE "SupportMessageSituation" AS ENUM ('RESOLVED', 'UNRESOLVED');

-- CreateEnum
CREATE TYPE "SupportMessageType" AS ENUM ('APPEAL', 'QUESTION', 'SUGGESTION');

-- CreateTable
CREATE TABLE "support_messages" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "replier_id" TEXT,
    "type" "SupportMessageType" NOT NULL,
    "subject" TEXT NOT NULL,
    "reply" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replied_at" TIMESTAMP(3),
    "situation" "SupportMessageSituation" NOT NULL DEFAULT 'UNRESOLVED',

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_replier_id_fkey" FOREIGN KEY ("replier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
