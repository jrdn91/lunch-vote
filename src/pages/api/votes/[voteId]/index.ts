// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getVoteById from "@/db/votes/getVoteById";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { voteId } = req.query;

  if (userId === null) {
    return res.status(401).send(`You must be authenticated to call this API`);
  }

  if (!voteId) {
    return res.status(400).send(`You must provide a voteId in the URL`);
  }

  if (req.method === "GET") {
    const vote = await getVoteById(voteId as string);
    return res.status(200).json({
      vote,
    });
  }
  return res
    .status(400)
    .send(`Method ${req.method} is not implemented for ${req.url}`);
}
