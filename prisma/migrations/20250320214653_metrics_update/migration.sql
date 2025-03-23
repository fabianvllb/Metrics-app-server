/*
  Warnings:

  - You are about to drop the column `name` on the `Metrics` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Metrics` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Metrics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sales_rep` to the `Metrics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Metrics" DROP COLUMN "name",
DROP COLUMN "value",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sales_rep" TEXT NOT NULL;
