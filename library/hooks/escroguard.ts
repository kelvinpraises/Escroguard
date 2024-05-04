import { ContractType } from "./swap/cancel";
import { PolybaseType } from "./polybase";

export type OrionType = ReturnType<typeof useEscroguard>;

const useEscroguard = ({
  polybase,
  contract,
}: {
  polybase?: PolybaseType;
  contract?: ContractType;
}) => {
  /* BEGIN SWAP */
  // -> swapInfo, cancelTokenSwap

  /* COMPLETE SWAP */

  const getCounterPartySwapInfo = (id: number) => {};

  const completeTokenSwap = (id: number) => {
    try {
      // completeTokenSwap(id);
    } catch (error) {
      console.error(error);
    }
  };

  /* FORUM */
  const sendMessage = () => {};

  const getMessages = () => {};

  /* ABOUT */
  // -> swapInfo

  /* SETTINGS */
  const swapInfo = () => {
    let swapName;
    let swapId;
    let swapContract;
    let swapOwner;
    let paymentAddress;
    let swapFee;
    let members;
    let tokenList;

    return {
      swapName,
      swapId,
      swapContract,
      swapOwner,
      paymentAddress,
      swapFee,
      members,
      tokenList,
    };
  };

  const renameSwap = () => {};

  const copySwapId = () => {};

  const addNewMember = () => {};

  const addNewToken = () => {};

  const changePaymentAddress = () => {};

  const changeSwapFee = () => {};

  const toggleFeeOnSwap = () => {};

  const transferOwnership = () => {};

  const toggleSwapActivity = () => {};

  const renounceOwnership = () => {};

  return {
    // -> swapInfo, cancelTokenSwap
    completeTokenSwap,

    sendMessage,
    getMessages,

    // -> swapInfo

    swapInfo,
    renameSwap,
    copySwapId,
    addNewMember,
    addNewToken,
    changePaymentAddress,
    changeSwapFee,
    toggleFeeOnSwap,
    transferOwnership,
    toggleSwapActivity,
    renounceOwnership,
  };
};

export default useEscroguard;
