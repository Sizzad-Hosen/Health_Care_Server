/*
  Warnings:

  - You are about to drop the column `doctorSchedulesDoctorId` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `doctorSchedulesScheduleId` on the `appointments` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointments" DROP CONSTRAINT "appointments_doctorSchedulesDoctorId_doctorSchedulesSchedu_fkey";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "doctorSchedulesDoctorId",
DROP COLUMN "doctorSchedulesScheduleId";

-- AddForeignKey
ALTER TABLE "doctor_schedules" ADD CONSTRAINT "doctor_schedules_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
