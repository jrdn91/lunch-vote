import { PrismaClient } from "@prisma/client";

const createVotes = async (prisma: PrismaClient) => {
  try {
    const result = await prisma.vote.create({
      data: {
        name: "Test Vote",
        open: false,
        creatorUserId: "user_2S4wvxxUfwJ9zMPkOeZSZhOAbYp",
        Items: {
          createMany: {
            data: [
              {
                name: "Item 1",
                id: 1,
              },
              {
                name: "Item 2",
                id: 2,
              },
              {
                name: "Item 3",
                id: 3,
              },
            ],
          },
        },
        UserVoteRanking: {
          createMany: {
            data: [
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhOAbYp",
                itemId: 1,
                order: 1,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhOAbYp",
                itemId: 2,
                order: 2,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhOAbYp",
                itemId: 3,
                order: 3,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhklojp",
                itemId: 1,
                order: 3,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhklojp",
                itemId: 2,
                order: 2,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOeZSZhklojp",
                itemId: 3,
                order: 1,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesk58OAbYp",
                itemId: 1,
                order: 2,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesk58OAbYp",
                itemId: 2,
                order: 3,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesk58OAbYp",
                itemId: 3,
                order: 1,
              },
              {
                userId: "user_2S4wsdjjffwJ9zMPkOeZSZhOAbYp",
                itemId: 1,
                order: 3,
              },
              {
                userId: "user_2S4wsdjjffwJ9zMPkOeZSZhOAbYp",
                itemId: 2,
                order: 2,
              },
              {
                userId: "user_2S4wsdjjffwJ9zMPkOeZSZhOAbYp",
                itemId: 3,
                order: 1,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesdhjgk34bYp",
                itemId: 1,
                order: 3,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesdhjgk34bYp",
                itemId: 2,
                order: 1,
              },
              {
                userId: "user_2S4wvxxUfwJ9zMPkOesdhjgk34bYp",
                itemId: 3,
                order: 2,
              },
            ],
          },
        },
      },
    });

    return Promise.resolve({ name: "leads", data: result });
  } catch (error) {
    return Promise.reject(error);
  }
};

export default createVotes;
