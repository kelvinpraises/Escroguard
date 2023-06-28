import { useEffect } from "react";
import { PolybaseType, Space } from "./polybase";
import { useAccount } from "wagmi";

export type OrionType = ReturnType<typeof useEscroguard>;

const useEscroguard = (polybase?: PolybaseType) => {
  /* LOGIN */
  const { isConnected } = useAccount();
  useEffect(() => {
    if (!polybase) return;
    const { login, logout, loggedIn } = polybase;

    if (isConnected && !loggedIn) {
      login();
      // TODO: put user info into state
    }

    if (!isConnected && loggedIn) {
      logout();
    }
  }, [isConnected, polybase]);

  const createSwap = () => {
    // collect the swapName, swapFee
    // call escroguard
    // get new contract address
    // save swap to polybase
  };

  const joinSwap = () => {};

  const joinedSwaps = () => {};

  /* DASHBOARD */
  const overview = () => {};

  const pendingSwaps = () => {};

  const cancelTokenSwap = () => {};

  const transactionHistory = () => {};

  /* SWAP */
  // -> swapInfo, cancelTokenSwap

  const calcSwapDetails = () => {};

  const beginTokenSwap = () => {};

  const completeTokenSwap = () => {};

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
    createSwap,
    joinSwap,
    joinedSwaps,

    overview,
    pendingSwaps,
    transactionHistory,
    cancelTokenSwap,

    // -> swapInfo, cancelTokenSwap
    calcSwapDetails,
    beginTokenSwap,
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
