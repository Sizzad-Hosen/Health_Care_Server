/*
  Warnings:

  - Added the required column `appointmentFee` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentWorkingPlace` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `designation` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qualification` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `Doctor` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "address" TEXT,
ADD COLUMN     "appointmentFee" INTEGER NOT NULL,
ADD COLUMN     "currentWorkingPlace" TEXT NOT NULL,
ADD COLUMN     "designation" TEXT NOT NULL,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "registrationNumber" TEXT NOT NULL;
