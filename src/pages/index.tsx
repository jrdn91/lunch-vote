import CreateVoteModal from "@/components/CreateVoteModal";
import Page from "@/components/Page";
import listVotesByUserId from "@/db/votes/listVotesByUserId";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { Button, Card, Flex, Title } from "@mantine/core";
import { Vote } from "@prisma/client";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { Plus, PlusCircle } from "react-feather";

interface HomePageProps {
  votes: Vote[];
}

export default function Home({ votes }: HomePageProps) {
  return (
    <Page initialVotes={votes}>
      <Flex
        justify="center"
        align="center"
        sx={{
          height: "100%",
        }}
      >
        <Card>
          <Flex direction={"column"} align={"center"} gap={16}>
            <Title order={4}>No Votes yet</Title>
            <CreateVoteModal>
              {({ openModal }) => (
                <Button
                  onClick={openModal}
                  leftIcon={<PlusCircle />}
                  color="dark"
                  variant="outline"
                >
                  Create new Vote
                </Button>
              )}
            </CreateVoteModal>
          </Flex>
        </Card>
      </Flex>
    </Page>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const votes = await listVotesByUserId(userId as string); // userId is valid here because of middleware

  // Load any data your application needs for the page using the userId
  return {
    props: {
      ...buildClerkProps(ctx.req),
      votes: votes.map((v) => ({
        ...v,
        created: dayjs(v.created).toISOString(),
        updated: dayjs(v.updated).toISOString(),
      })),
    },
  };
};
