/*
  Warnings:

  - You are about to drop the column `number_of_travellers` on the `leads` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "leads" DROP COLUMN "number_of_travellers",
ADD COLUMN     "number_of_adults" INTEGER,
ADD COLUMN     "number_of_children" INTEGER,
ADD COLUMN     "number_of_infants" INTEGER,
ADD COLUMN     "tags" TEXT[];
