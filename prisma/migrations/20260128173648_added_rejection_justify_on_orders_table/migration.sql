-- CreateEnum
CREATE TYPE "PaymentMethods" AS ENUM ('CREDIT_CARD', 'DEBIT_CARD', 'BANK_SLIP', 'PIX');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "rejection_justify" TEXT;
