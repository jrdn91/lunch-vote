/*
  Warnings:

  - Added the required column `creator_user_id` to the `votes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "votes" ADD COLUMN     "creator_user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "votes" ADD CONSTRAINT "votes_creator_user_id_fkey" FOREIGN KEY ("creator_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
