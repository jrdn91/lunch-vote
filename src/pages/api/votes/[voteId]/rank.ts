// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db";
import getUserRankingForVoteId, {
  UserRankedItems,
} from "@/db/items/getUserRankingForVoteId";
import listItemsByVoteId from "@/db/items/listItemsByVoteId";
import { getAuth } from "@clerk/nextjs/server";
import { orderBy } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

export interface RankBody {
  itemIds: number[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { voteId } = req.query;
  const body = req.body as RankBody;

  if (userId === null) {
    return res.status(401).send(`You must be authenticated to call this API`);
  }
  if (!voteId) {
    return res.status(400).send(`You must provide a voteId in the URL`);
  }
  if (!body) {
    return res
      .status(400)
      .send(
        `You must provide a body containing 'itemIds: number[]' in the URL`
      );
  }
  if (req.method === "POST") {
    // update or insert user rankings
    const existingUserRankings = await prisma.userVoteRanking.count({
      where: {
        voteId: voteId as string,
        userId,
      },
    });
    if (existingUserRankings > 0) {
      await prisma.$transaction([
        prisma.userVoteRanking.deleteMany({
          where: {
            userId,
            voteId: voteId as string,
          },
        }),
        prisma.userVoteRanking.createMany({
          data: body.itemIds.map((id, idx) => ({
            itemId: id,
            order: idx,
            userId,
            voteId: voteId as string,
          })),
        }),
      ]);
    } else {
      await prisma.userVoteRanking.createMany({
        data: body.itemIds.map((id, idx) => ({
          itemId: id,
          order: idx,
          userId,
          voteId: voteId as string,
        })),
      });
    }
    const userRankedItems = await getUserRankingForVoteId(
      voteId as string,
      userId
    );
    return res.status(200).json({
      items: userRankedItems,
    });
  }
  return res
    .status(400)
    .send(`Method ${req.method} is not implemented for ${req.url}`);
}
