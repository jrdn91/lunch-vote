import { createQueryKeyStore } from "@lukemorales/query-key-factory";

const queryKeys = createQueryKeyStore({
  votes: {
    detail: (voteId: string) => [voteId],
    list: null,
  },
  items: {
    list: (voteId: string) => [voteId],
  },
});

export default queryKeys;
