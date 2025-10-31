/*
  Warnings:

  - You are about to drop the column `properties` on the `Component` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Component` table. All the data in the column will be lost.
  - Added the required column `category` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codeFiles` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `componentName` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Component` table without a default value. This is not possible if the table is not empty.
  - Added the required column `previewCode` to the `Component` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Component" DROP COLUMN "properties",
DROP COLUMN "type",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "codeFiles" JSONB NOT NULL,
ADD COLUMN     "componentName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "previewCode" TEXT NOT NULL,
ADD COLUMN     "techStack" TEXT[];
