-- DropIndex
DROP INDEX "ContentProgress_userId_idx";

-- CreateIndex
CREATE INDEX "Course_category_published_idx" ON "Course"("category", "published");

-- CreateIndex
CREATE INDEX "LiveSession_hostId_idx" ON "LiveSession"("hostId");

-- CreateIndex
CREATE INDEX "LiveSession_courseId_idx" ON "LiveSession"("courseId");

-- CreateIndex
CREATE INDEX "Order_courseId_idx" ON "Order"("courseId");
