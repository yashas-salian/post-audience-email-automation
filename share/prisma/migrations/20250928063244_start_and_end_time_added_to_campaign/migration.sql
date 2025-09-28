/*
  Warnings:

  - Added the required column `End_date` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Start_date` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "End_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "Start_date" TIMESTAMP(3) NOT NULL;
