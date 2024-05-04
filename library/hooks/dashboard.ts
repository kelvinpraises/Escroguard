import { swapAbi } from "../data/constants";
import { store } from "../store/store";
import { DashboardState, Instance, InstanceState } from "../type";
import { useReducer } from "react";
import { getAddress } from "viem";
import { useContractRead } from "wagmi";

function useDashboard() {
  const contractAddress = store((state) => state.contractAddress);
  const address = store((state) => state.userAddress);

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

  const { isLoading } = useContractRead({
    abi: swapAbi,
    address: contractAddress,
    functionName: "findInstances",
    args: [getAddress(address)],
    onSuccess(data) {
      updateValues({
        pendingSwaps: serializeInstances(data.filter((x) => x.state !== 1)),
        swapHistory: serializeInstances(data),
      });
    },
  });

  return { values, isLoading };
}

export default useDashboard;

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
    state.set(0, "cancelled");
    state.set(0, "finished");

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
