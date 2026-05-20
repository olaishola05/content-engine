-- CreateTable
CREATE TABLE "generation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "inputType" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "platforms" TEXT[],
    "tone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_output" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "recommendedIndex" INTEGER NOT NULL,
    "recommendationReason" TEXT NOT NULL,
    "variations" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "generation_output_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "generation" ADD CONSTRAINT "generation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_output" ADD CONSTRAINT "generation_output_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
