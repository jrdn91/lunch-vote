import Page from "@/components/Page";
import { prisma } from "@/db";
import listVotesByUserId from "@/db/votes/listVotesByUserId";
import useListItems, { ItemsFromApi } from "@/hooks/api/items/useListItems";
import useUpdateRankings from "@/hooks/api/items/useUpdateRankings";
import useCloseVote from "@/hooks/api/votes/useCloseVote";
import useGetVote from "@/hooks/api/votes/useGetVote";
import useGetVoteRankings from "@/hooks/api/votes/useGetVoteRankings";
import useOpenVote from "@/hooks/api/votes/useOpenVote";
import { useAuth } from "@clerk/nextjs";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { Vote } from "@prisma/client";
import { IconTrophy } from "@tabler/icons-react";
import dayjs from "dayjs";
import { groupBy, orderBy, reduce } from "lodash";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useMemo, useState } from "react";

const Item = forwardRef<never, { name: string; order: number }>(
  ({ name, order, ...props }, ref) => {
    return (
      <Card
        {...props}
        ref={ref}
        sx={{ width: 400, backgroundColor: "highlight", opacity: 0.4 }}
      >
        <Group>
          <Avatar color="orange">{order}</Avatar>
          {name}
        </Group>
      </Card>
    );
  }
);

Item.displayName = "Item";
function SortableItem({
  item,
  order,
  disabled,
}: {
  item: ItemType;
  order: number;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const trophyIconColor = useMemo(() => {
    if (order === 1) {
      return "gold";
    }
    if (order === 2) {
      return "gray";
    }
    if (order === 3) {
      return "darksalmon";
    }
    return "gray";
  }, [order]);

  return (
    <Box sx={{ marginBottom: 16, cursor: !disabled ? "grab" : "default" }}>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          width: 400,
          backgroundColor: "white",
          ":hover": {
            backgroundColor: !disabled ? "Highlight" : "white",
          },
        }}
      >
        <Group>
          <Avatar
            color={disabled ? "gray" : "orange"}
            sx={{
              display: order > 3 ? "none" : "block",
            }}
            styles={{
              placeholder: {
                color: disabled ? trophyIconColor : undefined,
              },
            }}
          >
            {disabled ? <IconTrophy /> : order}
          </Avatar>
          {item.name}
        </Group>
      </Card>
    </Box>
  );
}

interface VotePageProps {
  votes: Vote[];
}

type ItemType = ItemsFromApi[number];

const V: NextPage<VotePageProps> = ({ votes }) => {
  const router = useRouter();

  const { userId } = useAuth();

  const [items, setItems] = useState<ItemsFromApi>([]);
  const [orderChanged, setOrderChanged] = useState<boolean>(false);

  useEffect(() => {
    if (router.query.voteId) {
      setOrderChanged(false);
    }
  }, [router.query.voteId]);

  const { data: vote } = useGetVote(router.query.voteId as string);

  const listItems = useListItems(router.query.voteId as string, {
    onSuccess(data) {
      setItems(data);
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getIndex = (item?: ItemType) =>
    items.findIndex((i) => i.id === item?.id);

  const [activeId, setActiveId] = useState<number | null>(null);
  const activeItem = items.find((i) => i.id === activeId);
  const activeIndex = activeItem ? getIndex(activeItem) : -1;

  const resetRankings = () => {
    setItems(() => listItems.data);
    setOrderChanged(false);
  };

  const updateRankings = useUpdateRankings(router.query.voteId as string);

  const submitRankings = () => {
    updateRankings
      .mutateAsync({
        itemIds: items.map((i) => i.id),
      })
      .then(() => {
        setOrderChanged(false);
      });
  };

  const closeVote = useCloseVote(router.query.voteId as string);
  const openVote = useOpenVote(router.query.voteId as string);

  const handleOpenOrCloseVote = () => {
    modals.openConfirmModal({
      title: "Are you sure?",
      children: (
        <Text size="sm">
          Are you sure you want to {vote?.open ? "close" : "open"} the vote?
        </Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onConfirm: () => {
        if (vote?.open) {
          closeVote.mutateAsync();
        } else {
          openVote.mutateAsync();
        }
      },
    });
  };

  const { data: rankings } = useGetVoteRankings(router.query.voteId as string, {
    enabled: vote?.open === false,
  });

  const rankedItems = useMemo(() => {
    if (rankings && !vote?.open) {
      const rankingsByItemId = groupBy(rankings, "itemId");
      const reducedRankings = Object.entries(rankingsByItemId).map(
        ([key, value]) => {
          console.log("value", value);
          return {
            itemId: Number(key),
            score: reduce(value, (acc, curr) => acc + curr.order, 0),
          };
        }
      );
      return orderBy(reducedRankings, ["score"], ["asc"])
        .map((r) => items.find((i) => i.id === r.itemId))
        .filter(Boolean) as ItemsFromApi;
    }
    return items;
  }, [rankings, items, vote?.open]);

  return (
    <Page initialVotes={votes}>
      <Flex
        mih={50}
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
        sx={{
          height: "100%",
        }}
      >
        {vote?.creatorUserId === userId && (
          <Card variant="outlined" sx={{ backgroundColor: "transparent" }}>
            <Group>
              <Text>Vote is {vote?.open ? "open" : "closed"} for rankings</Text>
              <Button
                onClick={handleOpenOrCloseVote}
                loading={closeVote.isLoading || openVote.isLoading}
                color={vote?.open ? "red" : "green"}
              >
                {vote?.open ? "Close" : "Open"} Vote
              </Button>
            </Group>
          </Card>
        )}
        {!vote && <Skeleton height={24} radius="xl" width={120} />}
        {vote && <Title order={2}>{vote?.name}</Title>}
        <Box>
          {rankedItems.length === 0 && (
            <Stack>
              <Card
                sx={{
                  width: 400,
                  backgroundColor: "white",
                }}
              >
                <Group dir="row" noWrap>
                  <Skeleton sx={{ flexShrink: 0 }} height={38} circle />
                  <Skeleton height={18} radius="xl" />
                </Group>
              </Card>
              <Card
                sx={{
                  width: 400,
                  backgroundColor: "white",
                }}
              >
                <Group dir="row" noWrap>
                  <Skeleton sx={{ flexShrink: 0 }} height={38} circle />
                  <Skeleton height={18} radius="xl" />
                </Group>
              </Card>
              <Card
                sx={{
                  width: 400,
                  backgroundColor: "white",
                }}
              >
                <Group dir="row" noWrap>
                  <Skeleton sx={{ flexShrink: 0 }} height={38} circle />
                  <Skeleton height={18} radius="xl" />
                </Group>
              </Card>
            </Stack>
          )}
          {rankedItems.length > 0 && (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ over }) => {
                  setActiveId(null);
                  if (over) {
                    const overIndex = rankedItems.findIndex(
                      (i) => i.id === over.id
                    );
                    if (activeIndex !== overIndex) {
                      setItems((items) =>
                        arrayMove(items, activeIndex, overIndex)
                      );
                      setOrderChanged(true);
                    }
                  }
                }}
                onDragStart={(event) => {
                  const { active } = event;

                  setActiveId(active.id as number);
                }}
              >
                <SortableContext
                  disabled={vote?.open === false}
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {rankedItems.map((item, idx) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      order={idx + 1}
                      disabled={vote?.open === false}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <Item
                      name={activeItem?.name || ""}
                      order={
                        rankedItems.findIndex(
                          (item) => item.id === activeItem?.id
                        ) + 1
                      }
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
              <SimpleGrid cols={2}>
                <Button
                  variant="default"
                  disabled={!orderChanged || updateRankings.isLoading}
                  onClick={resetRankings}
                >
                  Reset
                </Button>
                <Button
                  color="primary"
                  disabled={!orderChanged}
                  onClick={submitRankings}
                  loading={updateRankings.isLoading}
                >
                  Submit
                </Button>
              </SimpleGrid>
            </>
          )}
        </Box>
      </Flex>
    </Page>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const votes = await listVotesByUserId(userId as string); // userId is valid here because of middleware

  // get single vote detail
  if (ctx.params?.voteId) {
    const vote = await prisma.vote.findUnique({
      where: {
        id: ctx.params.voteId as string,
      },
    });
    if (!vote) {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

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

export default V;
