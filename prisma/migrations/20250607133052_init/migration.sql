-- CreateTable
CREATE TABLE "lecturers" (
    "nidk" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "lecturers_pkey" PRIMARY KEY ("nidk")
);

-- CreateTable
CREATE TABLE "students" (
    "npm" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "class" TEXT NOT NULL,
    "major" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("npm")
);

-- CreateTable
CREATE TABLE "presences" (
    "id" SERIAL NOT NULL,
    "npm" INTEGER NOT NULL,
    "nidk" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "presences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lecturers_nidk_key" ON "lecturers"("nidk");

-- CreateIndex
CREATE UNIQUE INDEX "students_npm_key" ON "students"("npm");

-- AddForeignKey
ALTER TABLE "presences" ADD CONSTRAINT "presences_nidk_fkey" FOREIGN KEY ("nidk") REFERENCES "lecturers"("nidk") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "presences" ADD CONSTRAINT "presences_npm_fkey" FOREIGN KEY ("npm") REFERENCES "students"("npm") ON DELETE RESTRICT ON UPDATE CASCADE;
