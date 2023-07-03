/*
  Warnings:

  - You are about to drop the `_UserToVote` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToVote" DROP CONSTRAINT "_UserToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToVote" DROP CONSTRAINT "_UserToVote_B_fkey";

-- DropTable
DROP TABLE "_UserToVote";

-- CreateTable
CREATE TABLE "UserVote" (
    "voteId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserVote_voteId_userId_key" ON "UserVote"("voteId", "userId");

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
