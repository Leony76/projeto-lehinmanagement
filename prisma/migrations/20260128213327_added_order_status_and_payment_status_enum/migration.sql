-- 1. Criar os novos tipos Enum
CREATE TYPE "PaymentStatus" AS ENUM ('APPROVED', 'REJECTED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED', 'DELETED_BY_USER');

-- 2. Limpeza da tabela 'orders'
-- Primeiro removemos o valor padrão antigo para não travar a conversão
ALTER TABLE "orders" ALTER COLUMN "status" DROP DEFAULT;

-- Agora convertemos o tipo da coluna
ALTER TABLE "orders" 
  ALTER COLUMN "status" TYPE "OrderStatus" 
  USING ("status"::text::"OrderStatus");

-- E finalmente colocamos o novo valor padrão
ALTER TABLE "orders" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- 3. Conversão da tabela 'order_history'
ALTER TABLE "order_history" 
  ALTER COLUMN "status" TYPE "OrderStatus" 
  USING ("status"::text::"OrderStatus");

-- 4. Conversão da tabela 'payments' com tratamento de erro
ALTER TABLE "payments" 
  ALTER COLUMN "status" TYPE "PaymentStatus" 
  USING (
    CASE 
      WHEN "status"::text IN ('APPROVED', 'REJECTED') THEN "status"::text::"PaymentStatus"
      ELSE 'REJECTED'::"PaymentStatus"
    END
  );

-- 5. Agora podemos apagar o tipo antigo com segurança
DROP TYPE "Status";