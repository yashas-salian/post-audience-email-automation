/*
  Warnings:

  - You are about to drop the column `Campaign_ID` on the `Campaign` table. All the data in the column will be lost.
  - Added the required column `Description` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Features` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Price` to the `Campaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `USP` to the `Campaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Campaign" DROP COLUMN "Campaign_ID",
ADD COLUMN     "Description" TEXT NOT NULL,
ADD COLUMN     "Features" TEXT NOT NULL,
ADD COLUMN     "Price" TEXT NOT NULL,
ADD COLUMN     "USP" TEXT NOT NULL;
