/*
  Warnings:

  - Added the required column `Post_description` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Campaign" ADD COLUMN     "Post_description" TEXT NOT NULL;
