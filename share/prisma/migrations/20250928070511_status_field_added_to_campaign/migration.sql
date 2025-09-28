/*
  Warnings:

  - Added the required column `Status` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "Status" TEXT NOT NULL;
