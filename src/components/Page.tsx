import Navbar from "@/components/Navbar";
import { UserButton } from "@clerk/nextjs";
import { AppShell, Group, Header, Title } from "@mantine/core";
import { Vote } from "@prisma/client";
import React, { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
  initialVotes?: Vote[];
}

const Page = ({ children, initialVotes }: PageProps) => {
  return (
    <AppShell
      padding="md"
      navbar={<Navbar initialVotes={initialVotes} />}
      header={
        <Header height={60}>
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Title order={2}>Lunch Vote</Title>
            <UserButton afterSignOutUrl="/" />
          </Group>
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.gray[0],
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default Page;
