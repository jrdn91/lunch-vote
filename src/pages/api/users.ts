// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/db";
import { UserJSON } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = req.body as UserJSON;

    if (body.id === null || !body.email_addresses) {
      return res
        .status(400)
        .send("A user.id and a body.email_addresses must be provided");
    }
    const foundUser = await prisma.user.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!foundUser) {
      // create a user
      try {
        await prisma.user.create({
          data: {
            id: body.id,
            name: body.email_addresses?.[0].email_address,
          },
        });
        return res.status(201);
      } catch (e) {
        console.log(e);
        return res.status(400).send("Could not verify user in DB");
      }
    }
    return res.status(200);
  }
  return res
    .status(400)
    .send(`Method ${req.method} is not implemented for ${req.url}`);
}
