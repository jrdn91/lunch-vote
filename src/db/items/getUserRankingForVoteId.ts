import { prisma } from "@/db";

async function getUserRankingForVoteId(voteId: string, userId: string) {
  const ranking = await prisma.userVoteRanking.findMany({
    select: {
      Item: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
    where: {
      voteId,
      userId,
    },
  });
  return ranking.map((rank) => ({
    ...rank.Item,
  }));
}

export type UserRankedItems = Awaited<
  ReturnType<typeof getUserRankingForVoteId>
>;

export default getUserRankingForVoteId;
