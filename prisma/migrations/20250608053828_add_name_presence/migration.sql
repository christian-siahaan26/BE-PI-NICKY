/*
  Warnings:

  - Added the required column `nameLecturer` to the `presences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nameStudent` to the `presences` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "presences" ADD COLUMN     "nameLecturer" TEXT NOT NULL,
ADD COLUMN     "nameStudent" TEXT NOT NULL;
