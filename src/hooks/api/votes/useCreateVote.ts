import queryKeys from "@/queryKeys";
import { Vote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export type NewVote = {
  name: string;
  items: string[];
};

type Response = {
  vote: Vote;
};

function useCreateVote() {
  const queryClient = useQueryClient();
  return useMutation(
    (data: NewVote) =>
      axios.post<Response>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/votes`,
        data
      ),
    {
      onSuccess(data) {
        queryClient.setQueryData(queryKeys.votes.list.queryKey, (oldData) => {
          if (oldData) {
            return [...(oldData as Vote[]), data];
          }
          return oldData;
        });
      },
    }
  );
}

export default useCreateVote;
