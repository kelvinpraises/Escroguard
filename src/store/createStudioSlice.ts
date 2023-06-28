import { immer } from "zustand/middleware/immer";

type State = {
  communityId: string | null;
};

type Actions = {
  setCommunityId: (id: string) => void;
};

export default immer<State & Actions>((set, get) => ({
  communityId: null,

  setCommunityId: (id) =>
    set((state) => {
      state.communityId = id;
    }),
}));
