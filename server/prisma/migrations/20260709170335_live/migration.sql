/*
  Warnings:

  - You are about to drop the column `isActive` on the `LiveSession` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `LiveSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roomName]` on the table `LiveSession` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `hostId` to the `LiveSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomName` to the `LiveSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LiveSession` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `LiveSession` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "LiveSessionStatus" AS ENUM ('SCHEDULED', 'LIVE', 'ENDED', 'CANCELLED');

-- AlterTable
ALTER TABLE "LiveSession" DROP COLUMN "isActive",
DROP COLUMN "link",
ADD COLUMN     "courseId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endedAt" TIMESTAMP(3),
ADD COLUMN     "hostId" TEXT NOT NULL,
ADD COLUMN     "recordingUrl" TEXT,
ADD COLUMN     "roomName" TEXT NOT NULL,
ADD COLUMN     "scheduledAt" TIMESTAMP(3),
ADD COLUMN     "status" "LiveSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LiveSession_roomName_key" ON "LiveSession"("roomName");

-- CreateIndex
CREATE INDEX "LiveSession_status_idx" ON "LiveSession"("status");

-- AddForeignKey
ALTER TABLE "LiveSession" ADD CONSTRAINT "LiveSession_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiveSession" ADD CONSTRAINT "LiveSession_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
