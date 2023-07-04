// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db";
import { users } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

interface UserSearchQuery {
  search: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  const { search } = req.query as unknown as UserSearchQuery;

  if (userId === null) {
    return res.status(401).send(`You must be authenticated to call this API`);
  }
  if (req.method === "GET") {
    const foundUsers = await users.getUserList({
      query: search,
    });
    // const foundUsers = await prisma.user.findMany({
    //   where: {
    //     name: {
    //       contains: search,
    //     },
    //     NOT: {
    //       id: userId,
    //     },
    //   },
    // });
    return res.status(200).json({
      users: foundUsers.filter((user) => user.id !== userId),
    });
  }
  return res
    .status(400)
    .send(`Method ${req.method} is not implemented for ${req.url}`);
}
