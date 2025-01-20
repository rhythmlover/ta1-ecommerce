/*
  Warnings:

  - You are about to drop the column `total_cost` on the `Cart` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[optionId]` on the table `CartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `totalCost` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "total_cost",
ADD COLUMN     "totalCost" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_optionId_key" ON "CartItem"("optionId");
