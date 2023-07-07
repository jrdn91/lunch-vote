import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeys = createQueryKeyStore({
  votes: {
    detail: (voteId: string) => [voteId],
    list: null,
  },
  rankings: {
    detail: (voteId: string) => [voteId],
  },
  items: {
    list: (voteId: string) => [voteId],
  },
  users: {
    search: (searchTerm: string) => [searchTerm],
  },
});

export default queryKeys;
