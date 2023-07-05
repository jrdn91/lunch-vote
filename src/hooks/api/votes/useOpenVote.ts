import queryKeys from "@/queryKeys";
import { Vote } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Response = {
  vote: Vote;
};

function useOpenVote(voteId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    () =>
      axios.post<Response>(
        `${process.env.NEXT_PUBLIC_API_URL}/api/votes/${voteId}/open`
      ),
    {
      onSuccess() {
        queryClient.setQueryData(
          queryKeys.votes.detail(voteId).queryKey,
          (oldData) => {
            if (oldData) {
              return { ...(oldData as Vote), open: true };
            }
            return oldData;
          }
        );
      },
    }
  );
}

export default useOpenVote;
