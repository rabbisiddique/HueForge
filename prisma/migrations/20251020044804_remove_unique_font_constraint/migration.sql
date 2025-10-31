/*
  Warnings:

  - You are about to drop the column `fonts` on the `Typography` table. All the data in the column will be lost.
  - Added the required column `fontFamily` to the `Typography` table without a default value. This is not possible if the table is not empty.
  - Added the required column `levels` to the `Typography` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Typography` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Palette" ALTER COLUMN "colors" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Typography" DROP COLUMN "fonts",
ADD COLUMN     "fontFamily" TEXT NOT NULL,
ADD COLUMN     "levels" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "prompt" TEXT;
