import { Address } from "viem";
import { immer } from "zustand/middleware/immer";

type State = {
  spaceId: string | null;
  contractAddress: Address | undefined;
};

type Actions = {
  setSpaceId: (id: string) => void;
  setContractAddress: (id: Address) => void;
};

export default immer<State & Actions>((set, get) => ({
  spaceId: null,
  contractAddress: undefined,

  setSpaceId: (id) =>
    set((state) => {
      state.spaceId = id;
    }),

  setContractAddress: (address) =>
    set((state) => {
      state.contractAddress = address;
    }),
}));
