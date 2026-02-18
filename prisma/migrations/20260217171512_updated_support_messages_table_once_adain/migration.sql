-- DropForeignKey
ALTER TABLE "support_messages" DROP CONSTRAINT "support_messages_receiver_id_fkey";

-- AlterTable
ALTER TABLE "support_messages" ALTER COLUMN "receiver_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
