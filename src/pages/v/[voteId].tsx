import Page from "@/components/Page";
import { prisma } from "@/db";
import listVotesByUserId from "@/db/votes/listVotesByUserId";
import useListItems from "@/hooks/api/items/useListItems";
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
  Card,
  Flex,
  Group,
  Skeleton,
  Stack,
  Title,
} from "@mantine/core";
import { Vote } from "@prisma/client";
import dayjs from "dayjs";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { forwardRef, useState } from "react";

const Item = forwardRef<never, { id: string; order: number }>(
  ({ id, order, ...props }, ref) => {
    return (
      <Card
        {...props}
        ref={ref}
        sx={{ width: 400, backgroundColor: "highlight", opacity: 0.4 }}
      >
        <Group>
          <Avatar color="orange">{order}</Avatar>
          {id}
        </Group>
      </Card>
    );
  }
);

Item.displayName = "Item";
function SortableItem({
  id,
  active,
  order,
  ...props
}: {
  id: string;
  active: boolean;
  order: number;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box sx={{ padding: 4, cursor: "grab" }}>
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
          {id}
        </Group>
      </Card>
    </Box>
  );
}

interface VotePageProps {
  votes: Vote[];
}

const V: NextPage<VotePageProps> = ({ votes }) => {
  const router = useRouter();

  const [items, setItems] = useState<string[]>([]);

  const { data: vote } = useGetVote(router.query.voteId as string);

  useListItems(router.query.voteId as string, {
    onSuccess(data) {
      setItems(data.map((item) => item.name));
    },
  });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getIndex = (id: UniqueIdentifier) => items.indexOf(id as string);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const activeIndex = activeId ? getIndex(activeId) : -1;

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
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={({ over }) => {
                setActiveId(null);
                if (over) {
                  const overIndex = getIndex(over.id);
                  if (activeIndex !== overIndex) {
                    setItems((items) =>
                      arrayMove(items, activeIndex, overIndex)
                    );
                  }
                }
              }}
              onDragStart={(event) => {
                const { active } = event;

                setActiveId(active.id);
              }}
            >
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
              >
                {items.map((id, idx) => (
                  <SortableItem
                    key={id}
                    id={id}
                    order={idx + 1}
                    active={activeId === id}
                  />
                ))}
              </SortableContext>
              <DragOverlay>
                {activeId ? (
                  <Item
                    id={activeId as string}
                    order={items.indexOf(activeId as string) + 1}
                  />
                ) : null}
              </DragOverlay>
            </DndContext>
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
