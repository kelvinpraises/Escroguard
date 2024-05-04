"use client";
import { useReducer } from "react";
import { useDebounce } from "usehooks-ts";
import { parseEther } from "viem";
import {
  Address,
  useContractRead,
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { swapAbi } from "../data/constants";
import { store } from "../store/store";
import { SwapAction, SwapInfo } from "../type";

const useSwap = ({ id, action }: { id?: number; action: SwapAction }) => {
  const contractAddress = store((state) => state.contractAddress);
  const userAddress = store((state) => state.userAddress);

  if (!contractAddress || !userAddress) throw new Error("Instance error");
  if (action === "complete" && id === undefined)
    throw new Error("Id is undefined");

  const [swapInfo, updateSwapInfo] = useReducer(
    (current: SwapInfo, update: Partial<SwapInfo>): SwapInfo => ({
      ...current,
      ...update,
    }),
    {
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
    }
  );
  const debouncedInitiatorAmount = useDebounce(
    swapInfo.initiator.tokenDetails.amount,
    500
  );
  const debouncedCPAmount = useDebounce(
    swapInfo.counterParty.tokenDetails.amount,
    500
  );

  const swapContract = {
    abi: swapAbi,
    address: contractAddress,
  } as const;

  useContractReads({
    contracts: [
      {
        ...swapContract,
        functionName: "ownerFeePermille",
      } as const,
      {
        ...swapContract,
        functionName: "noOwnerFeeERC20s",
        args: [swapInfo.initiator.tokenDetails.address!],
      } as const,
      {
        ...swapContract,
        functionName: "noOwnerFeeERC20s",
        args: [swapInfo.counterParty.tokenDetails.address!],
      } as const,
    ],
    enabled: satisfies([
      action === "begin",
      swapInfo.initiator.tokenDetails.address,
      swapInfo.initiator.tokenDetails.amount,
      swapInfo.counterParty.tokenDetails.address,
      swapInfo.counterParty.tokenDetails.amount,
    ]),
    onSuccess(data) {
      const ownerFeePercent = Number(data[0]?.result) / 10; // from ‰ to %

      let initiatorTokenDetails = {
        ...swapInfo.initiator.tokenDetails,
        noFeeOnTokenSwap: false,
      };
      let cpTokenDetails = {
        ...swapInfo.counterParty.tokenDetails,
        noFeeOnTokenSwap: false,
      };

      initiatorTokenDetails.noFeeOnTokenSwap = data[1]?.result!;
      cpTokenDetails.noFeeOnTokenSwap = data[2]?.result!;

      const ratio1 = initiatorTokenDetails.amount! / cpTokenDetails.amount!;
      const rate1 = `${ratio1} ${initiatorTokenDetails.symbol} = 1 ${cpTokenDetails.symbol}`;

      const ratio2 = cpTokenDetails.amount! / initiatorTokenDetails.amount!;
      const rate2 = `${ratio2} ${cpTokenDetails.symbol} = 1 ${initiatorTokenDetails.symbol}`;

      const details = [initiatorTokenDetails, cpTokenDetails]
        .filter((tokenDetails) => tokenDetails.noFeeOnTokenSwap === false)
        .map((tokenDetails) => {
          const deductible = parseFloat(
            (tokenDetails.amount! * (ownerFeePercent / 100)).toFixed(4)
          );
          return `${deductible} ${tokenDetails.symbol}`;
        });

      const swapFee = details.length
        ? `${ownerFeePercent}% @ ${details.join(" | ")}`
        : "Free";

      updateSwapInfo({
        rates: [rate1, rate2],
        swapFee,
      });
    },
  });

  const { config: beginConfig } = usePrepareContractWrite({
    ...swapContract,
    functionName: "begin",
    value: parseEther("0"),
    args: [
      userAddress,
      BigInt(debouncedInitiatorAmount!),
      swapInfo.counterParty.tokenDetails.address!,
      BigInt(debouncedCPAmount!),
      swapInfo.counterParty.userAddress!,
    ],
    enabled: satisfies([
      action === "begin",
      userAddress,
      debouncedInitiatorAmount,
      swapInfo.counterParty.tokenDetails.address,
      debouncedCPAmount,
      swapInfo.counterParty.userAddress,
    ]),
  });

  const begin = useContractWrite(beginConfig);

  useContractRead({
    ...swapContract,
    functionName: "counterPartyInstances",
    args: [userAddress, BigInt(id!)],
    enabled: action === "complete",
    onSuccess(data) {
      updateSwapInfo({
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
    },
  });

  const { config } = usePrepareContractWrite({
    ...swapContract,
    functionName: "complete",
    args: [BigInt(id!)],
    enabled: action === "complete",
  });

  const complete = useContractWrite(config);

  return {
    swapInfo,
    updateSwapInfo,
    begin,
    complete,
  };
};

export default useSwap;

function getSymbol(arg0: Address): string {
  throw new Error("Function not implemented.");
}

function satisfies(array: any[]) {
  return array.every(Boolean);
}
