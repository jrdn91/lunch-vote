import queryKeys from "@/queryKeys";
import { UserVoteRanking } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Response = {
  items: UserVoteRanking[];
};

function useGetVoteRankings(voteId: string, options?: { enabled?: boolean }) {
  return useQuery(
    queryKeys.rankings.detail(voteId).queryKey,
    () =>
      axios
        .get<Response>(`/api/votes/${voteId}/rank`)
        .then((res) => res.data.items),
    {
      ...options,
    }
  );
}

export default useGetVoteRankings;
