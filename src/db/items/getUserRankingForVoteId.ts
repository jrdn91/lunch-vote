import { prisma } from "@/db";

async function getUserRankingForVoteId(voteId: string, userId: string) {
  const ranking = await prisma.userVoteRanking.findMany({
    select: {
      order: true,
      Item: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    where: {
      voteId,
      userId,
    },
  });
  return ranking.map((rank) => ({
    ...rank.Item,
    order: rank.order,
  }));
}

export type UserRankedItems = Awaited<
  ReturnType<typeof getUserRankingForVoteId>
>;

export default getUserRankingForVoteId;
