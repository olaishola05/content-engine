-- CreateTable
CREATE TABLE "brand_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileType" TEXT NOT NULL DEFAULT 'BASIC',
    "documentUrls" TEXT[],
    "brandName" TEXT,
    "tagline" TEXT,
    "niche" TEXT,
    "audience" TEXT,
    "toneOfVoice" TEXT,
    "contentPillars" TEXT[],
    "keyPhrases" TEXT[],
    "avoidPhrases" TEXT[],
    "platformHandles" JSONB,
    "ctaStyle" TEXT,
    "brandValues" TEXT[],
    "uniquePositioning" TEXT,
    "primaryColor" TEXT,
    "font" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brand_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_profile_userId_key" ON "brand_profile"("userId");

-- AddForeignKey
ALTER TABLE "brand_profile" ADD CONSTRAINT "brand_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
