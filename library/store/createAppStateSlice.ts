import { immer } from "zustand/middleware/immer";

type State = {
  appActive: boolean;
};

type Actions = {
  setAppActive: (isActive: boolean) => void;
};

export default immer<State & Actions>((set, get) => ({
  appActive: false,

  setAppActive: (isActive) =>
    set((state) => {
      state.appActive = isActive;
    }),
}));
