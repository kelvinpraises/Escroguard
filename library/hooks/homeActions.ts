import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { HomeActionState } from "../types";

const reducer = (
  current: HomeActionState,
  update: Partial<HomeActionState>
): HomeActionState => ({
  ...current,
  ...update,
  swapFees:
    update.swapFees === undefined
      ? current.swapFees
      : isNaN(update.swapFees)
      ? 0
      : Math.max(update.swapFees, 0),
});

const initialState = {
  swapName: "",
  swapFees: 0,
  swapId: "",
  joined: [],
};

const useHomeActions = () => {
  const router = useRouter();

  const [values, updateValues] = useReducer(reducer, initialState);

  const joinSwap = (id: string) => {
    try {
      router.push(`/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    values,
    updateValues,
    joinSwap,
  };
};

export default useHomeActions;
