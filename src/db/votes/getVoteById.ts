import { prisma } from "@/db";

async function getVoteById(voteId: string) {
  return await prisma.vote.findUnique({
    where: {
      id: voteId,
    },
  });
}

export default getVoteById;
