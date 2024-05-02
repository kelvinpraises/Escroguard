import { swapAbi } from "../../data/constants";
import { store } from "../../store/store";
import { useContractWrite } from "wagmi";

const useCancelSwap = () => {
  const contractAddress = store((state) => state.contractAddress);

  if (!contractAddress) throw new Error("Instance error");

  return useContractWrite({
    abi: swapAbi,
    address: contractAddress,
    functionName: "cancel",
    args: []
  });
};

export default useCancelSwap;
