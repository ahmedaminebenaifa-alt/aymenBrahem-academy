-- CreateTable
CREATE TABLE "ContentProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentBlockId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContentProgress_userId_idx" ON "ContentProgress"("userId");

-- CreateIndex
CREATE INDEX "ContentProgress_contentBlockId_idx" ON "ContentProgress"("contentBlockId");

-- CreateIndex
CREATE UNIQUE INDEX "ContentProgress_userId_contentBlockId_key" ON "ContentProgress"("userId", "contentBlockId");

-- AddForeignKey
ALTER TABLE "ContentProgress" ADD CONSTRAINT "ContentProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentProgress" ADD CONSTRAINT "ContentProgress_contentBlockId_fkey" FOREIGN KEY ("contentBlockId") REFERENCES "ContentBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;
