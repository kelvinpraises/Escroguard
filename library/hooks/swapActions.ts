"use client";
import useStore from "@/store";
import { useReducer } from "react";
import { useDebounce } from "usehooks-ts";
import { Address, parseEther } from "viem";
import {
  useReadContract,
  useReadContracts,
  useSimulateContract,
  useWriteContract,
} from "wagmi";
import { swapAbi } from "../data/constants";
import { SwapAction, SwapState } from "../type";

const initialState: SwapState = {
  rates: [],
  swapFee: "",
  initiator: {
    userAddress: null,
    tokenDetails: {
      address: null,
      symbol: null,
      amount: null,
    },
  },
  counterParty: {
    userAddress: null,
    tokenDetails: {
      address: null,
      symbol: null,
      amount: null,
    },
  },
};

const reducer = (state: SwapState, update: Partial<SwapState>): SwapState => ({
  ...state,
  ...update,
});

function getSymbol(arg0: Address): string {
  throw new Error("Function not implemented.");
}

function satisfies(array: any[]) {
  return array.every(Boolean);
}

const useSwapActions = ({
  id,
  action,
}: {
  id?: number;
  action: SwapAction;
}) => {
  const contractAddress = useStore((store) => store.contractAddress);
  const userAddress = useStore((store) => store.userAddress);

  if (!contractAddress || !userAddress) throw new Error("Instance error");
  if ((action === "complete" || action === "cancel") && id === undefined)
    throw new Error("Id is undefined");

  const [swapState, updateSwapState] = useReducer(reducer, initialState);
  const debouncedInitiatorAmount = useDebounce(
    swapState.initiator.tokenDetails.amount,
    500
  );
  const debouncedCPAmount = useDebounce(
    swapState.counterParty.tokenDetails.amount,
    500
  );

  const swapContract = {
    abi: swapAbi,
    address: contractAddress,
  } as const;

  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*                 Begin Swap Action Section                 */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

  const readContractsResult = useReadContracts({
    contracts: [
      {
        ...swapContract,
        functionName: "ownerFeePermille",
      } as const,
      {
        ...swapContract,
        functionName: "noOwnerFeeERC20s",
        args: [swapState.initiator.tokenDetails.address!],
      } as const,
      {
        ...swapContract,
        functionName: "noOwnerFeeERC20s",
        args: [swapState.counterParty.tokenDetails.address!],
      } as const,
    ],
    query: {
      enabled: satisfies([
        action === "begin",
        swapState.initiator.tokenDetails.address,
        swapState.initiator.tokenDetails.amount,
        swapState.counterParty.tokenDetails.address,
        swapState.counterParty.tokenDetails.amount,
      ]),
    },
  });

  if (readContractsResult.status === "success") {
    const data = readContractsResult.data;

    const ownerFeePercent = Number(data[0]?.result) / 10; // from ‰ to %

    const initiatorTokenDetails = {
      ...swapState.initiator.tokenDetails,
      noFeeOnTokenSwap: data[1]?.result!,
    };
    const cpTokenDetails = {
      ...swapState.counterParty.tokenDetails,
      noFeeOnTokenSwap: data[2]?.result!,
    };

    const ratio1 = initiatorTokenDetails.amount! / cpTokenDetails.amount!;
    const rate1 = `${ratio1} ${initiatorTokenDetails.symbol} = 1 ${cpTokenDetails.symbol}`;

    const ratio2 = cpTokenDetails.amount! / initiatorTokenDetails.amount!;
    const rate2 = `${ratio2} ${cpTokenDetails.symbol} = 1 ${initiatorTokenDetails.symbol}`;

    // FIXME: Only show relevant fees to the parties
    const details = [initiatorTokenDetails, cpTokenDetails]
      .filter(({ noFeeOnTokenSwap }) => !noFeeOnTokenSwap)
      .map(({ amount, symbol }) => {
        const deductible = ((amount! * ownerFeePercent) / 100).toFixed(4);
        return `${parseFloat(deductible)} ${symbol}`;
      });

    const swapFee = details.length
      ? `${ownerFeePercent}% @ ${details.join(" | ")}`
      : "Free";

    updateSwapState({
      rates: [rate1, rate2],
      swapFee,
    });
  }

  const { data: beginData } = useSimulateContract({
    ...swapContract,
    functionName: "begin",
    value: parseEther("0"),
    args: [
      userAddress,
      BigInt(debouncedInitiatorAmount!),
      swapState.counterParty.tokenDetails.address!,
      BigInt(debouncedCPAmount!),
      swapState.counterParty.userAddress!,
    ],
    query: {
      enabled: satisfies([
        action === "begin",
        userAddress,
        debouncedInitiatorAmount,
        swapState.counterParty.tokenDetails.address,
        debouncedCPAmount,
        swapState.counterParty.userAddress,
      ]),
    },
  });

  const begin = useWriteContract();

  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*               Complete Swap Action Section               */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

  const readContractResult = useReadContract({
    ...swapContract,
    functionName: "counterPartyInstances",
    args: [userAddress, BigInt(id!)],
    query: {
      enabled: action === "complete",
    },
  });

  if (readContractResult.status === "success") {
    const data = readContractResult.data;
    updateSwapState({
      initiator: {
        userAddress: data[1],
        tokenDetails: {
          address: data[2],
          symbol: getSymbol(data[2]),
          amount: Number(data[3]),
        },
      },
      counterParty: {
        userAddress: data[4],
        tokenDetails: {
          address: data[5],
          symbol: getSymbol(data[5]),
          amount: Number(data[6]),
        },
      },
    });
  }

  const { data: completeData } = useSimulateContract({
    ...swapContract,
    functionName: "complete",
    args: [BigInt(id!)],
    query: {
      enabled: action === "complete",
    },
  });

  const complete = useWriteContract();

  /*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
  /*                Cancel Swap Action Section                */
  /*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

  const { data: cancelData } = useSimulateContract({
    abi: swapAbi,
    address: contractAddress,
    functionName: "cancel",
    args: [BigInt(id!)],
    query: {
      enabled: action === "cancel",
    },
  });

  const cancel = useWriteContract();

  return {
    swapInfo: swapState,
    updateSwapInfo: updateSwapState,
    begin,
    beginData,
    complete,
    completeData,
    cancel,
    cancelData,
  };
};

export default useSwapActions;
