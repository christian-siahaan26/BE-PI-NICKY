/*
  Warnings:

  - You are about to drop the column `class` on the `presences` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `students` table. All the data in the column will be lost.
  - Added the required column `clas` to the `presences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clas` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "presences" DROP COLUMN "class",
ADD COLUMN     "clas" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "class",
ADD COLUMN     "clas" TEXT NOT NULL;
