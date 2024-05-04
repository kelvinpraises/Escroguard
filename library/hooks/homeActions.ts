import { factoryAbi } from "../data/constants";
import { store } from "../store/store";
import { HomeActionState } from "../type";
import { useRouter } from "next/navigation";
import { useEffect, useReducer, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useContractRead } from "wagmi";
import { PolybaseType } from "./polybase";
import useTypedSignerDispatch from "./typedSignerDispatch";

const useHomeActions = (polybase: PolybaseType) => {
  const userId = store((state) => state.userId);
  const userAddress = store((state) => state.userAddress);

  // if (!userId || !userAddress) throw new Error("Instance error");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [values, updateValues] = useReducer(
    (
      current: HomeActionState,
      update: Partial<HomeActionState>
    ): HomeActionState => ({
      ...current,
      ...update,
    }),
    {
      swapName: "",
      swapFees: "",
      swapId: "",
      joined: [],
    }
  );

  const { isSuccess, signTypedData: deploySwap } = useTypedSignerDispatch({
    to: process.env.NEXT_PUBLIC_FACTORY as Address,
    data: encodeFunctionData({
      abi: factoryAbi,
      functionName: "deploySwap",
      args: [userAddress!, BigInt(values.swapFees)],
    }),
  });

  useContractRead({
    address: process.env.NEXT_PUBLIC_FACTORY as Address,
    abi: factoryAbi,
    functionName: "findInstances",
    args: [userAddress!],
    enabled: isSuccess,
    onSuccess(contractAddresses) {
      const { createSpace } = polybase;
      const contractAddress = contractAddresses[contractAddresses.length - 1];

      (async () => {
        try {
          await createSpace({
            name: values.swapName,
            contractAddress,
            adminAddress: userAddress!,
            members: [userAddress!],
            userId: userId!,
          });

          router.push(`/${contractAddress}`);
        } catch (error) {
          console.error(error);
        }
      })();
    },
    onError(err) {
      setIsLoading(false);
      alert("something went wrong");
      console.error(err);
    },
  });

  const joinSwap = (id: string) => {
    const { addSpaceToUser } = polybase;

    try {
      addSpaceToUser(userId!, id);

      router.push(`/${id}`);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    (async () => {
      const { getUserRecord, getSpaceRecord } = polybase;

      try {
        const { spacesId } = await getUserRecord(userId!);

        const spaceRecords = await Promise.all(
          spacesId.map(async (id) => {
            const { name, contractAddress } = await getSpaceRecord(id);
            return { id, name, contractAddress };
          })
        );

        updateValues({ joined: spaceRecords });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return {
    values,
    updateValues,
    joinSwap,
    deploySwap,
    isLoading,
    setIsLoading,
  };
};

export default useHomeActions;
