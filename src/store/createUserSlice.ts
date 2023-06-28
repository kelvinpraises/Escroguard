import { immer } from "zustand/middleware/immer";

type State = {
  userId: string | null;
};

type Actions = {
  setUserId: (id: string | null) => void;
};

export default immer<State & Actions>((set, get) => ({
  userId: null,

  setUserId: (id) =>
    set((state) => {
      state.userId = id;
    }),
}));
