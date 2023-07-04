// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db";
import listVotesByUserId from "@/db/votes/listVotesByUserId";
import { NewVote } from "@/hooks/api/votes/useCreateVote";
import { users } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId, user } = getAuth(req);

  if (userId === null) {
    return res.status(401).send(`You must be authenticated to call this API`);
  }
  const foundUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!foundUser) {
    // create a user
    try {
      await prisma.user.create({
        data: {
          id: userId,
          name: user?.emailAddresses?.[0].emailAddress || "",
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(400).send("Could not verify user in DB");
    }
  }
  if (req.method === "POST") {
    const body = req.body as NewVote;
    // const invitedUserIds = await prisma.user.findMany({
    //   select: {
    //     id: true,
    //   },
    //   where: {
    //     id: {
    //       in: body.invites,
    //     },
    //   },
    // });
    const invitedUsers = await users.getUserList({
      emailAddress: body.invites,
    });
    const newVote = await prisma.vote.create({
      data: {
        name: body.name,
        Items: {
          createMany: {
            data: body.items.map((item) => ({
              name: item,
            })),
          },
        },
        creatorUserId: userId,
        Users: {
          createMany: {
            data: invitedUsers.map((user) => ({
              userId: user.id,
            })),
          },
        },
      },
    });
    // await prisma.userVote.create({
    //   data: {
    //     userId: userId,
    //     voteId: newVote.id,
    //   },
    // });
    return res.status(201).json({
      vote: newVote,
    });
  }
  if (req.method === "GET") {
    const votes = await listVotesByUserId(userId);
    return res.status(200).json({
      votes,
    });
  }
  return res
    .status(400)
    .send(`Method ${req.method} is not implemented for ${req.url}`);
}
