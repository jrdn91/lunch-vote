import { prisma } from "@/db";

async function listItemsByVoteId(voteId: string) {
  const items = await prisma.item.findMany({
    select: {
      id: true,
      name: true,
    },
    where: {
      voteId,
    },
  });
  return items;
}

export default listItemsByVoteId;
