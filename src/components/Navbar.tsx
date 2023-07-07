import CreateVoteModal from "@/components/CreateVoteModal";
import useListVotes from "@/hooks/api/votes/useListVotes";
import {
  Avatar,
  Navbar as MNavbar,
  NavLink,
  Skeleton,
  Stack,
} from "@mantine/core";
import { Vote } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { PlusCircle } from "react-feather";

interface NavbarProps {
  initialVotes?: Vote[];
}

const Navbar = ({ initialVotes }: NavbarProps) => {
  const { data: votes, isLoading } = useListVotes({
    initialData: initialVotes,
  });

  const router = useRouter();

  return (
    <MNavbar width={{ base: 300 }} p="xs">
      <MNavbar.Section mt="md">
        {isLoading && (
          <Stack>
            <Skeleton height={54} radius="sm" />
            <Skeleton height={54} radius="sm" />
            <Skeleton height={54} radius="sm" />
          </Stack>
        )}
        {!isLoading &&
          votes?.map((vote) => (
            <Link href={`/v/${vote.id}`} key={vote.id}>
              <NavLink
                label={vote.name}
                icon={<Avatar>🍕</Avatar>}
                active={router.query && router.query.voteId === vote.id}
                component="span"
              />
            </Link>
          ))}
      </MNavbar.Section>
      <MNavbar.Section>
        <CreateVoteModal>
          {({ openModal }) => (
            <NavLink
              onClick={openModal}
              label="Create new Vote"
              icon={<PlusCircle />}
            />
          )}
        </CreateVoteModal>
      </MNavbar.Section>
    </MNavbar>
  );
};

export default Navbar;
