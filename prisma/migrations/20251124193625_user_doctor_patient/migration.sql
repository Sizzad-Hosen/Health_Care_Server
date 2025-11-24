/*
  Warnings:

  - A unique constraint covering the columns `[adminId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[doctorId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[patientId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_email_fkey";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "address" TEXT,
ADD COLUMN     "gender" "Gender";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adminId" TEXT,
ADD COLUMN     "doctorId" TEXT,
ADD COLUMN     "patientId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_adminId_key" ON "User"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "User_doctorId_key" ON "User"("doctorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_patientId_key" ON "User"("patientId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;
