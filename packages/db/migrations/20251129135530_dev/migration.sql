/*
  Warnings:

  - The values [INDIVIDUAL,CORPORATE] on the enum `CustomerType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CustomerType_new" AS ENUM ('B2C', 'B2B_CORPORATE', 'B2B_AGENCY');
ALTER TABLE "public"."customers" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "customers" ALTER COLUMN "type" TYPE "CustomerType_new" USING ("type"::text::"CustomerType_new");
ALTER TYPE "CustomerType" RENAME TO "CustomerType_old";
ALTER TYPE "CustomerType_new" RENAME TO "CustomerType";
DROP TYPE "public"."CustomerType_old";
ALTER TABLE "customers" ALTER COLUMN "type" SET DEFAULT 'B2C';
COMMIT;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "vat_number" TEXT,
ALTER COLUMN "type" SET DEFAULT 'B2C';

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "budget" DOUBLE PRECISION,
ADD COLUMN     "cities" TEXT[],
ADD COLUMN     "company_name" TEXT,
ADD COLUMN     "destinations" TEXT[],
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "whatsapp_number" TEXT;

-- CreateTable
CREATE TABLE "customer_family_relations" (
    "customer_id" TEXT NOT NULL,
    "member_id" TEXT NOT NULL,
    "relation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_family_relations_pkey" PRIMARY KEY ("customer_id","member_id")
);

-- CreateTable
CREATE TABLE "customer_associate_relations" (
    "customer_id" TEXT NOT NULL,
    "associate_id" TEXT NOT NULL,
    "relation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_associate_relations_pkey" PRIMARY KEY ("customer_id","associate_id")
);

-- AddForeignKey
ALTER TABLE "customer_family_relations" ADD CONSTRAINT "customer_family_relations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_family_relations" ADD CONSTRAINT "customer_family_relations_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_associate_relations" ADD CONSTRAINT "customer_associate_relations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_associate_relations" ADD CONSTRAINT "customer_associate_relations_associate_id_fkey" FOREIGN KEY ("associate_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
