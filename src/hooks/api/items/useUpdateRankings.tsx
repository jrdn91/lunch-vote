import { ItemsFromApi } from "@/hooks/api/items/useListItems";
import { RankBody } from "@/pages/api/votes/[voteId]/rank";
import queryKeys from "@/queryKeys";
import { Avatar } from "@mantine/core";
import { notifications } from "@mantine/notifications";

import { Vote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Check, X } from "react-feather";

type Response = {
  items: ItemsFromApi;
};

function useUpdateRankings(voteId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    (data: RankBody) =>
      axios.post<Response>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/votes/${voteId}/rank`,
        data
      ),
    {
      onSuccess(data) {
        queryClient.setQueryData(
          queryKeys.items.list(voteId).queryKey,
          (oldData) => {
            if (oldData) {
              return [...(oldData as ItemsFromApi), data];
            }
            return oldData;
          }
        );
        notifications.show({
          icon: (
            <Avatar color="green" size="md" radius={"lg"}>
              <Check size="1.1rem" />
            </Avatar>
          ),
          message: "Updated rankings",
        });
      },
      onError() {
        notifications.show({
          icon: (
            <Avatar color="red" size="md" radius={"lg"}>
              <X size="1.1rem" />
            </Avatar>
          ),
          message: "There was an error creating a new vote",
        });
      },
    }
  );
}

export default useUpdateRankings;
