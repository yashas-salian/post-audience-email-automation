-- CreateTable
CREATE TABLE "public"."User" (
    "ID" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "public"."Assets" (
    "ID" TEXT NOT NULL,
    "Company_name" TEXT,
    "Product_name" TEXT NOT NULL,
    "Asset_type" TEXT NOT NULL,
    "Url" TEXT NOT NULL,

    CONSTRAINT "Assets_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");
