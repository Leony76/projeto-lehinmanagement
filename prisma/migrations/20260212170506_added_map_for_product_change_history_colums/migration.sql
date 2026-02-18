/*
  Warnings:

  - You are about to drop the `ProductChangeHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductChangeHistory" DROP CONSTRAINT "ProductChangeHistory_adminId_fkey";

-- DropForeignKey
ALTER TABLE "ProductChangeHistory" DROP CONSTRAINT "ProductChangeHistory_productId_fkey";

-- DropTable
DROP TABLE "ProductChangeHistory";

-- CreateTable
CREATE TABLE "product_changes_history" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "admin_id" TEXT NOT NULL,
    "action" "ProductAdminAction" NOT NULL,
    "justification" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_changes_history_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_changes_history" ADD CONSTRAINT "product_changes_history_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_changes_history" ADD CONSTRAINT "product_changes_history_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
