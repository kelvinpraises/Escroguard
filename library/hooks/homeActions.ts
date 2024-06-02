import { useRouter } from "next/navigation";
import { useReducer } from "react";
import { HomeActionState } from "../type";

const reducer = (
  current: HomeActionState,
  update: Partial<HomeActionState>
): HomeActionState => ({
  ...current,
  ...update,
});

const initialState = {
  swapName: "",
  swapFees: "",
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
