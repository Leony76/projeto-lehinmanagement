-- CreateEnum
CREATE TYPE "AdminAction" AS ENUM ('USER_DEACTIVATED', 'USER_ACTIVATED', 'PRODUCT_REMOVED', 'PRODUCT_EDITED', 'ORDER_CANCELED', 'PAYMENT_REFUNDED');

-- CreateTable
CREATE TABLE "admin_action_history" (
    "id" SERIAL NOT NULL,
    "action" "AdminAction" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actor_id" TEXT NOT NULL,
    "target_user_id" TEXT,
    "target_product_id" INTEGER,
    "target_order_id" INTEGER,

    CONSTRAINT "admin_action_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admin_action_history" ADD CONSTRAINT "admin_action_history_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_history" ADD CONSTRAINT "admin_action_history_target_user_id_fkey" FOREIGN KEY ("target_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_history" ADD CONSTRAINT "admin_action_history_target_product_id_fkey" FOREIGN KEY ("target_product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_action_history" ADD CONSTRAINT "admin_action_history_target_order_id_fkey" FOREIGN KEY ("target_order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
