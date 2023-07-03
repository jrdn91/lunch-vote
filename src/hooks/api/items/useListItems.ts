import { UserRankedItems } from "@/db/items/getUserRankingForVoteId";
import listItemsByVoteId from "@/db/items/listItemsByVoteId";
import queryKeys from "@/queryKeys";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type ItemsFromApi = Awaited<ReturnType<typeof listItemsByVoteId>>;

type Response = {
  items: ItemsFromApi;
};

function useListItems(
  voteId: string,
  props?: {
    initialData?: ItemsFromApi;
    onSuccess?: (data: ItemsFromApi) => void;
  }
) {
  return useQuery(
    queryKeys.items.list(voteId).queryKey,
    () =>
      axios
        .get<Response>(
          `${process.env.NEXT_PUBLIC_API_URL}/api/votes/${voteId}/items`
        )
        .then((res) => res.data.items),
    {
      initialData: props?.initialData,
      onSuccess: props?.onSuccess,
    }
  );
}

export default useListItems;
