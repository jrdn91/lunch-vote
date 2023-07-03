-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "voteId" INTEGER,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_voteId_fkey" FOREIGN KEY ("voteId") REFERENCES "votes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
