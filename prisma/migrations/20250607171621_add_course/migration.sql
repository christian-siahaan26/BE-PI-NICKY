/*
  Warnings:

  - The primary key for the `lecturers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `course` to the `presences` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "presences" DROP CONSTRAINT "presences_nidk_fkey";

-- AlterTable
ALTER TABLE "lecturers" DROP CONSTRAINT "lecturers_pkey",
ALTER COLUMN "nidk" SET DATA TYPE TEXT,
ADD CONSTRAINT "lecturers_pkey" PRIMARY KEY ("nidk");

-- AlterTable
ALTER TABLE "presences" ADD COLUMN     "course" TEXT NOT NULL,
ALTER COLUMN "nidk" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "presences" ADD CONSTRAINT "presences_nidk_fkey" FOREIGN KEY ("nidk") REFERENCES "lecturers"("nidk") ON DELETE RESTRICT ON UPDATE CASCADE;
