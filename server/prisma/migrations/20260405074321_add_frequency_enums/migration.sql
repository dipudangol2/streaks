/*
  Warnings:

  - The `frequency` column on the `Habit` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "FREQUENCY" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY');

-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "frequency",
ADD COLUMN     "frequency" "FREQUENCY" NOT NULL DEFAULT 'DAILY';
