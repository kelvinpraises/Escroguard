import { Address } from "wagmi";
import { immer } from "zustand/middleware/immer";

type State = {
  userId: string | null;
  userAddress: Address | null;
};

type Actions = {
  setUserId: (id: string | null) => void;
  setUserAddress: (id: Address | null) => void;
};

export default immer<State & Actions>((set, get) => ({
  userId: null,
  userAddress: "0x0000000000000000000000000000000000000000",

  setUserId: (id) =>
    set((state) => {
      state.userId = id;
    }),

  setUserAddress: (id) =>
    set((state) => {
      state.userAddress = id;
    }),
}));
