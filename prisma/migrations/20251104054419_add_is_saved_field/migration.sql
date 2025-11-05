-- AlterTable
ALTER TABLE "Component" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Palette" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Typography" ADD COLUMN     "isSaved" BOOLEAN NOT NULL DEFAULT false;
