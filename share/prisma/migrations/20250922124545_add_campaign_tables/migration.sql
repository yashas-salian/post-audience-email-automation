/*
  Warnings:

  - You are about to drop the `Assets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."Assets";

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "ID" TEXT NOT NULL,
    "Campaign_ID" TEXT NOT NULL,
    "Product_name" TEXT NOT NULL,
    "Campany_name" TEXT NOT NULL,
    "User_ID" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "public"."Post" (
    "ID" TEXT NOT NULL,
    "Day" INTEGER NOT NULL,
    "URL" TEXT NOT NULL,
    "SURL" TEXT NOT NULL,
    "Caption" TEXT,
    "Hashtags" TEXT,
    "Campaign_ID" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "public"."Ad" (
    "ID" TEXT NOT NULL,
    "URL" TEXT NOT NULL,
    "SURL" TEXT NOT NULL,
    "Product_name" TEXT NOT NULL,
    "Campany_name" TEXT NOT NULL,
    "Campaign_ID" TEXT NOT NULL,

    CONSTRAINT "Ad_pkey" PRIMARY KEY ("ID")
);

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "public"."User"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Post" ADD CONSTRAINT "Post_Campaign_ID_fkey" FOREIGN KEY ("Campaign_ID") REFERENCES "public"."Campaign"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ad" ADD CONSTRAINT "Ad_Campaign_ID_fkey" FOREIGN KEY ("Campaign_ID") REFERENCES "public"."Campaign"("ID") ON DELETE CASCADE ON UPDATE CASCADE;
