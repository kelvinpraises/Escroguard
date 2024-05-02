"use client";
import { swapAbi } from "@/data/constants";
import { store } from "@/store/store";
import { SwapInfo } from "@/type";
import { useReducer } from "react";
import { useDebounce } from "usehooks-ts";
import { parseEther } from "viem";
import {
  useContractReads,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";

const useBeginSwap = () => {
  const contractAddress = store((state) => state.contractAddress);
  const userAddress = store((state) => state.userAddress);

  if (!contractAddress || !userAddress) throw new Error("Instance error");

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
          noFeeOnTokenSwap: null,
        },
      },
      counterParty: {
        userAddress: null,
        tokenDetails: {
          address: null,
          symbol: null,
          amount: null,
          noFeeOnTokenSwap: null,
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
      swapInfo.initiator.tokenDetails.address,
      swapInfo.initiator.tokenDetails.amount,
      swapInfo.counterParty.tokenDetails.address,
      swapInfo.counterParty.tokenDetails.amount,
    ]),
    onSuccess(data) {
      const ownerFeePercent = Number(data[0]?.result) / 10; // from ‰ to %

      const initiatorTokenDetails = swapInfo.initiator.tokenDetails;
      const cpTokenDetails = swapInfo.counterParty.tokenDetails;

      initiatorTokenDetails.noFeeOnTokenSwap = data[1]?.result!;
      cpTokenDetails.noFeeOnTokenSwap = data[2]?.result!;

      const ratio1 = initiatorTokenDetails.amount! / cpTokenDetails.amount!;
      const rate1 = `${ratio1} ${initiatorTokenDetails.symbol} = 1 ${cpTokenDetails.symbol}`;

      const ratio2 = cpTokenDetails.amount! / initiatorTokenDetails.amount!;
      const rate2 = `${ratio2} ${cpTokenDetails.symbol} = 1 ${initiatorTokenDetails.symbol}`;

      const details = [swapInfo.initiator, swapInfo.counterParty]
        .filter(({ tokenDetails }) => tokenDetails.noFeeOnTokenSwap === false)
        .map(({ tokenDetails }) => {
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

  const { config } = usePrepareContractWrite({
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
      userAddress,
      debouncedInitiatorAmount,
      swapInfo.counterParty.tokenDetails.address,
      debouncedCPAmount,
      swapInfo.counterParty.userAddress,
    ]),
  });

  const begin = useContractWrite(config);

  return {
    swapInfo,
    updateSwapInfo,
    begin,
  };
};

export default useBeginSwap;

function satisfies(array: any[]) {
  return array.every(Boolean);
}
