import { create } from "zustand";
import { devtools } from "zustand/middleware";
import createSpaceSlice from "./createSpaceSlice";
import createUserSlice from "./createUserSlice";

type StateFromFunctions<T extends [...any]> = T extends [infer F, ...infer R]
  ? F extends (...args: any) => object
    ? StateFromFunctions<R> & ReturnType<F>
    : unknown
  : unknown;

type State = StateFromFunctions<
  [typeof createSpaceSlice, typeof createUserSlice]
>;

export const store = create<State>()(
  devtools(
    (set, get, store) => ({
      ...createSpaceSlice(set, get, store),
      ...createUserSlice(set, get, store),
    }),
    { name: "quiverbliss" }
  )
);
