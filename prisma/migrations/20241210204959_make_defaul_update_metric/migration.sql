/*
  Warnings:

  - You are about to drop the column `img` on the `Coffee` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Coffee` table. All the data in the column will be lost.
  - The `density` column on the `Coffee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `acidity` column on the `Coffee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Fild` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fields` to the `Coffee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `Coffee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `short` to the `Coffee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fild" DROP CONSTRAINT "Fild_coffeeId_fkey";

-- AlterTable
ALTER TABLE "Coffee" DROP COLUMN "img",
DROP COLUMN "type",
ADD COLUMN     "fields" JSONB NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "short" TEXT NOT NULL,
ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT,
DROP COLUMN "density",
ADD COLUMN     "density" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "acidity",
ADD COLUMN     "acidity" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "Fild";

-- DropTable
DROP TABLE "User";

-- DropEnum
DROP TYPE "Acidity";

-- DropEnum
DROP TYPE "Density";

-- DropEnum
DROP TYPE "Role";
