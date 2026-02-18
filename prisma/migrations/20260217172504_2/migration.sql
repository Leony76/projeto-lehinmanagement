-- CreateTable
CREATE TABLE "support_messages" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "receiver_id" TEXT,
    "replier_id" TEXT,
    "type" "SupportMessageType" NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "reply" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "replied_at" TIMESTAMP(3),
    "sentBy" "SupportMessageSentBy" NOT NULL,
    "situation" "SupportMessageSituation" NOT NULL DEFAULT 'UNRESOLVED',
    "user_situation" "UserSituation" NOT NULL,

    CONSTRAINT "support_messages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_messages" ADD CONSTRAINT "support_messages_replier_id_fkey" FOREIGN KEY ("replier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
