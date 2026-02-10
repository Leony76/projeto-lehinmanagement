/*
  Warnings:

  - Made the column `created_at` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "created_at" SET NOT NULL;
