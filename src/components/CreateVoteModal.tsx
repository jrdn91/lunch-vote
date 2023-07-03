import useCreateVote, { NewVote } from "@/hooks/api/votes/useCreateVote";
import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Card,
  Flex,
  Group,
  Modal,
  Stack,
  Stepper,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import React, { ReactNode, useRef, useState } from "react";
import { Check, Plus, X } from "react-feather";
import { z } from "zod";
import { produce } from "immer";

interface CreateVoteModalProps {
  children: (props: { openModal: () => void }) => ReactNode;
}

const nameSchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
});

const itemSchema = z.object({
  name: z.string().min(2, { message: "Name should have at least 2 letters" }),
});

type FormValues = z.infer<typeof nameSchema>;

const CreateVoteModal = ({ children }: CreateVoteModalProps) => {
  const newVoteData = useRef<NewVote>({ name: "", items: [] });

  const [opened, handlers] = useDisclosure(false);

  const [newItems, setNewItems] = useState<string[]>([]);

  const [active, setActive] = useState(0);
  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const router = useRouter();

  const nameForm = useForm<FormValues>({
    initialValues: {
      name: "",
    },
    validate: zodResolver(nameSchema),
  });

  const itemForm = useForm<FormValues>({
    initialValues: {
      name: "",
    },
    validate: zodResolver(itemSchema),
  });

  const createVote = useCreateVote();

  const handleNameSubmit = async (values: FormValues) => {
    newVoteData.current = { ...newVoteData.current, name: values.name };
    nextStep();
  };

  const submitItemsStep = () => {
    newVoteData.current = { ...newVoteData.current, items: newItems };
    nextStep();
  };

  const handleItemSubmit = async (values: FormValues) => {
    setNewItems((state) => {
      return produce(state, (draft) => {
        draft.push(values.name);
      });
    });
    itemForm.reset();
  };

  const submitInviteStep = async () => {
    nextStep();
    try {
      const response = await createVote.mutateAsync(newVoteData.current);
      notifications.show({
        icon: (
          <Avatar color="green" size="md" radius={"lg"}>
            <Check size="1.1rem" />
          </Avatar>
        ),
        message: "New vote was created successfully",
      });
      router.push(`/v/${response.data.vote.id}`);
    } catch (e) {
      notifications.show({
        icon: (
          <Avatar color="red" size="md" radius={"lg"}>
            <X size="1.1rem" />
          </Avatar>
        ),
        message: "There was an error creating a new vote",
      });
      prevStep();
    }
  };

  return (
    <>
      {children({
        openModal: handlers.open,
      })}
      <Modal
        opened={opened}
        onClose={handlers.close}
        title="New Vote"
        centered
        size="xl"
      >
        <Stepper
          active={active}
          onStepClick={setActive}
          breakpoint="sm"
          allowNextStepsSelect={false}
        >
          <Stepper.Step label="Name">
            <form onSubmit={nameForm.onSubmit(handleNameSubmit)}>
              <TextInput
                withAsterisk
                label="Name"
                placeholder="New Vote Name"
                {...nameForm.getInputProps("name")}
              />

              <Group position="right" mt="md">
                <Button type="submit" loading={createVote.isLoading}>
                  Next
                </Button>
              </Group>
            </form>
          </Stepper.Step>
          <Stepper.Step label="Items">
            <Stack>
              {newItems.map((item, idx) => (
                <Card
                  key={`${idx}-${item}`}
                  sx={(theme) => ({
                    boxShadow: theme.shadows.sm,
                    border: `1px solid ${theme.colors.dark[0]}`,
                  })}
                >
                  {item}
                </Card>
              ))}
              <form onSubmit={itemForm.onSubmit(handleItemSubmit)}>
                <Group sx={{ alignItems: "flex-end" }}>
                  <TextInput
                    withAsterisk
                    label="Name"
                    placeholder="New Vote Name"
                    {...itemForm.getInputProps("name")}
                  />
                  <ActionIcon
                    type="submit"
                    variant="filled"
                    color="primary"
                    size={36}
                  >
                    <Plus size="1rem" />
                  </ActionIcon>
                </Group>
              </form>
            </Stack>
            <Group position="right" mt="md">
              <Button onClick={submitItemsStep}>Next</Button>
            </Group>
          </Stepper.Step>
          <Stepper.Step label="Invite">
            <Text c="dimmed">Coming Soon...</Text>
            <Group position="right" mt="md">
              <Button onClick={submitInviteStep}>Submit</Button>
            </Group>
          </Stepper.Step>
          <Stepper.Completed>Creating new Vote...</Stepper.Completed>
        </Stepper>
      </Modal>
    </>
  );
};

export default CreateVoteModal;
