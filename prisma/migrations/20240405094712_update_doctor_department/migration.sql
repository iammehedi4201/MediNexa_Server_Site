/*
  Warnings:

  - Changed the type of `department` on the `doctors` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DoctorDepartment" AS ENUM ('CARDIOLOGY', 'DERMATOLOGY', 'GASTROENTEROLOGY', 'GYNECOLOGY', 'NEPHROLOGY', 'NEUROLOGY', 'ORTHOPEDICS', 'PSYCHIATRY', 'UROLOGY');

-- AlterTable
ALTER TABLE "doctors" DROP COLUMN "department",
ADD COLUMN     "department" "DoctorDepartment" NOT NULL;

-- DropEnum
DROP TYPE "doctorDepartment";
