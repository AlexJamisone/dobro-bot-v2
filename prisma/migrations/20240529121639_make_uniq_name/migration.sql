-- CreateEnum
CREATE TYPE "Acidity" AS ENUM ('Bitter', 'Neutral', 'Acid');

-- CreateEnum
CREATE TYPE "Density" AS ENUM ('Tea', 'Neutral', 'Dense');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coffee" (
    "id" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "qid" INTEGER,
    "description" TEXT[],
    "Iid" INTEGER,
    "type" DOUBLE PRECISION NOT NULL,
    "density" "Density" DEFAULT 'Tea',
    "acidity" "Acidity" DEFAULT 'Bitter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coffee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fild" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "coffeeId" TEXT,

    CONSTRAINT "Fild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coffee_name_key" ON "Coffee"("name");

-- AddForeignKey
ALTER TABLE "Fild" ADD CONSTRAINT "Fild_coffeeId_fkey" FOREIGN KEY ("coffeeId") REFERENCES "Coffee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
