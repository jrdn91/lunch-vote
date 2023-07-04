import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeys = createQueryKeyStore({
  votes: {
    detail: (voteId: string) => [voteId],
    list: null,
  },
  items: {
    list: (voteId: string) => [voteId],
  },
  users: {
    search: (searchTerm: string) => [searchTerm],
  },
});

export default queryKeys;
