import { prisma } from "@/db";

async function listVotesByUserId(userId: string) {
  const votes = await prisma.userVote.findMany({
    select: {
      Vote: true,
    },
    where: {
      userId,
    },
  });
  return votes.map((v) => v.Vote);
}

export default listVotesByUserId;
