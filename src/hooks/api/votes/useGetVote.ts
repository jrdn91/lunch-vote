import queryKeys from "@/queryKeys";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Response = {
  vote: Vote;
};

function useGetVote(voteId: string, props?: { initialData?: Vote }) {
  return useQuery(
    queryKeys.votes.detail(voteId).queryKey,
    () =>
      axios.get<Response>(`/api/votes/${voteId}`).then((res) => res.data.vote),
    {
      initialData: props?.initialData,
    }
  );
}

export default useGetVote;
