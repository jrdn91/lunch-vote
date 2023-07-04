import queryKeys from "@/queryKeys";
import { User } from "@clerk/clerk-sdk-node";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

type Response = {
  users: User[];
};

function useSearchUsers(searchTerm: string) {
  return useQuery(
    queryKeys.users.search(searchTerm).queryKey,
    () =>
      axios
        .get<Response>(`${process.env.NEXT_PUBLIC_API_URL}/api/users/search`, {
          params: {
            search: searchTerm,
          },
        })
        .then((res) => res.data),
    {
      select(data) {
        return data.users;
      },
      enabled: searchTerm.length >= 3,
    }
  );
}

export default useSearchUsers;
