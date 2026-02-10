-- CreateTable
CREATE TABLE "CostumerProduct" (
    "id" SERIAL NOT NULL,
    "costumer_id" TEXT NOT NULL,
    "costumer_product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "CostumerProduct_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CostumerProduct" ADD CONSTRAINT "CostumerProduct_costumer_id_fkey" FOREIGN KEY ("costumer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostumerProduct" ADD CONSTRAINT "CostumerProduct_costumer_product_id_fkey" FOREIGN KEY ("costumer_product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
