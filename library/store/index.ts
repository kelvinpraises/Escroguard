import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createAppStateSlice from "./createAppStateSlice";
import createSpaceSlice from "./createSpaceSlice";
import createUserSlice from "./createUserSlice";

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

type State = StateFromFunctions<
  [typeof createSpaceSlice, typeof createUserSlice, typeof createAppStateSlice]
>;

export default create<State>()(
  devtools(
    (set, get, store) => ({
      ...createSpaceSlice(set, get, store),
      ...createUserSlice(set, get, store),
      ...createAppStateSlice(set, get, store),
    }),
    { name: "escroguard" }
  )
);
