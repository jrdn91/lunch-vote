-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "passageId" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_vote_rankings" (
    "order" INTEGER NOT NULL,
    "voteId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_UserToVote" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_vote_rankings_voteId_userId_itemId_key" ON "user_vote_rankings"("voteId", "userId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "_UserToVote_AB_unique" ON "_UserToVote"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToVote_B_index" ON "_UserToVote"("B");

-- AddForeignKey
ALTER TABLE "user_vote_rankings" ADD CONSTRAINT "user_vote_rankings_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vote_rankings" ADD CONSTRAINT "user_vote_rankings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_vote_rankings" ADD CONSTRAINT "user_vote_rankings_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVote" ADD CONSTRAINT "_UserToVote_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToVote" ADD CONSTRAINT "_UserToVote_B_fkey" FOREIGN KEY ("B") REFERENCES "votes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
