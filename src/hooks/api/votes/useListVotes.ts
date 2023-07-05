import queryKeys from "@/queryKeys";
import { Vote } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Response = {
  votes: Vote[];
};

function useListVotes(props?: { initialData?: Vote[] }) {
  return useQuery(
    queryKeys.votes.list.queryKey,
    () => axios.get<Response>(`/api/votes`).then((res) => res.data.votes),
    {
      initialData: props?.initialData,
    }
  );
}

export default useListVotes;
