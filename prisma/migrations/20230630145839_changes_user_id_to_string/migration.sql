/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `passageId` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_UserToVote" DROP CONSTRAINT "_UserToVote_A_fkey";

-- DropForeignKey
ALTER TABLE "user_vote_rankings" DROP CONSTRAINT "user_vote_rankings_userId_fkey";

-- AlterTable
ALTER TABLE "_UserToVote" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user_vote_rankings" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "passageId",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "users_id_seq";

-- AddForeignKey
ALTER TABLE "user_vote_rankings" ADD CONSTRAINT "user_vote_rankings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVote" ADD CONSTRAINT "_UserToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
