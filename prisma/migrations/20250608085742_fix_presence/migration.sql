/*
  Warnings:

  - Added the required column `class` to the `presences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `major` to the `presences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "presences" ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "major" TEXT NOT NULL;
