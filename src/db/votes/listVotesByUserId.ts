import { prisma } from "@/db";

async function listVotesByUserId(userId: string) {
  const createdVotes = await prisma.vote.findMany({
    where: {
      creatorUserId: userId,
    },
  });
  const invitedVotes = await prisma.userVote.findMany({
    where: {
      userId,
    },
    select: {
      Vote: true,
    },
  });
  return createdVotes.concat(invitedVotes.map(({ Vote }) => Vote));
}

export default listVotesByUserId;
