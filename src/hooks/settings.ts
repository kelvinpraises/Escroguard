import { swapAbi } from "@/data/constants";
import { store } from "@/store/store";
import { useContractWrite } from "wagmi";

const useSettings = () => {
  const contractAddress = store((state) => state.contractAddress);

  if (!contractAddress) throw new Error("Instance error");

  const swapContract = {
    abi: swapAbi,
    address: contractAddress,
  } as const;

  return useContractWrite({
    ...swapContract,
  });
};

export default useSettings;
