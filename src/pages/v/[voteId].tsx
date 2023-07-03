import Page from "@/components/Page";
import { prisma } from "@/db";
import listVotesByUserId from "@/db/votes/listVotesByUserId";
import useListItems, { ItemsFromApi } from "@/hooks/api/items/useListItems";
import useUpdateRankings from "@/hooks/api/items/useUpdateRankings";
import useGetVote from "@/hooks/api/votes/useGetVote";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
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
  Title,
} from "@mantine/core";
import { Vote } from "@prisma/client";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { forwardRef, useEffect, useState } from "react";

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
  active,
  order,
  ...props
}: {
  item: ItemType;
  active: boolean;
  order: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box sx={{ marginBottom: 16, cursor: "grab" }}>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        sx={{
          width: 400,
          backgroundColor: "white",
          ":hover": {
            backgroundColor: "Highlight",
          },
        }}
      >
        <Group>
          <Avatar color="orange">{order}</Avatar>
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
        {!vote && <Skeleton height={24} radius="xl" width={120} />}
        {vote && <Title order={2}>{vote?.name}</Title>}
        <Box>
          {items.length === 0 && (
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
          {items.length > 0 && (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={({ over }) => {
                  setActiveId(null);
                  if (over) {
                    console.log(over);
                    console.log(activeItem);
                    const overIndex = items.findIndex((i) => i.id === over.id);
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
                  items={items}
                  strategy={verticalListSortingStrategy}
                >
                  {items.map((item, idx) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      order={idx + 1}
                      active={activeItem?.id === item.id}
                    />
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeItem ? (
                    <Item
                      name={activeItem?.name || ""}
                      order={
                        items.findIndex((item) => item.id === activeItem?.id) +
                        1
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
