/*
  Warnings:

  - The primary key for the `votes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "UserVote" DROP CONSTRAINT "UserVote_voteId_fkey";

-- DropForeignKey
ALTER TABLE "items" DROP CONSTRAINT "items_voteId_fkey";

-- DropForeignKey
ALTER TABLE "user_vote_rankings" DROP CONSTRAINT "user_vote_rankings_voteId_fkey";

-- AlterTable
ALTER TABLE "UserVote" ALTER COLUMN "voteId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "items" ALTER COLUMN "voteId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_vote_rankings" ALTER COLUMN "voteId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "votes" DROP CONSTRAINT "votes_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "votes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "votes_id_seq";

-- AddForeignKey
ALTER TABLE "UserVote" ADD CONSTRAINT "UserVote_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vote_rankings" ADD CONSTRAINT "user_vote_rankings_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
