import useStore from "@/store";
import { useEffect, useReducer } from "react";
import { useReadContract } from "wagmi";
import { swapAbi } from "../data/constants";
import { DashboardState, Instance, InstanceState } from "../type";

function useSwapTradeHistory() {
  const contractAddress = useStore((store) => store.contractAddress);
  const address = useStore((store) => store.userAddress);

  if (!contractAddress || !address) throw new Error("Instance error");

  const [values, updateValues] = useReducer(
    (
      current: DashboardState,
      update: Partial<DashboardState>
    ): DashboardState => ({
      ...current,
      ...update,
    }),
    {
      pendingSwaps: [],
      swapHistory: [],
    }
  );

  const readContractResult = useReadContract({
    abi: swapAbi,
    address: contractAddress,
    functionName: "findInstances",
    args: [address],
  });

  useEffect(() => {
    if (readContractResult.status !== "success") return;

    const data = readContractResult.data;

    updateValues({
      pendingSwaps: serializeInstances(data.filter((x) => x.state === 0)),
      swapHistory: serializeInstances(data.filter((x) => x.state !== 0)),
    });
  }, [readContractResult]);

  return { values, isLoading: readContractResult.isLoading };
}

export default useSwapTradeHistory;

function serializeInstances(
  data: readonly {
    id: bigint;
    initiator: `0x${string}`;
    initiatorERC20: `0x${string}`;
    initiatorAmount: bigint;
    counterParty: `0x${string}`;
    counterPartyERC20: `0x${string}`;
    counterPartyAmount: bigint;
    state: number;
  }[]
) {
  return data.map((x) => {
    const state: Map<number, InstanceState> = new Map();
    state.set(0, "begun");
    state.set(1, "finished");
    state.set(2, "cancelled");

    const instance: Instance = {
      ...x,
      id: Number(x.id),
      initiatorAmount: Number(x.initiatorAmount),
      counterPartyAmount: Number(x.counterPartyAmount),
      state: state.get(x.state)!,
    };

    return instance;
  });
}
