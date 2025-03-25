/*
  Warnings:

  - You are about to drop the column `imageId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `seoId` on the `Collection` table. All the data in the column will be lost.
  - You are about to drop the column `values` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the column `seoId` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Cart` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CartLine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PriceModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SelectedOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SeoModel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `imageUrl` to the `Collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Made the column `handle` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CartLine" DROP CONSTRAINT "CartLine_cartId_fkey";

-- DropForeignKey
ALTER TABLE "CartLine" DROP CONSTRAINT "CartLine_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_imageId_fkey";

-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_seoId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_seoId_fkey";

-- DropForeignKey
ALTER TABLE "SelectedOption" DROP CONSTRAINT "SelectedOption_variantId_fkey";

-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- AlterTable
ALTER TABLE "Collection" DROP COLUMN "imageId",
DROP COLUMN "seoId",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "values",
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "seoId",
ALTER COLUMN "handle" SET NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- DropTable
DROP TABLE "Cart";

-- DropTable
DROP TABLE "CartLine";

-- DropTable
DROP TABLE "ImageModel";

-- DropTable
DROP TABLE "PriceModel";

-- DropTable
DROP TABLE "SelectedOption";

-- DropTable
DROP TABLE "SeoModel";

-- DropTable
DROP TABLE "Variant";
