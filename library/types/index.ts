import { Address } from "viem";

export type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

export type SwapAction = "begin" | "complete" | "cancel";
export type HomeAction = "create" | "join" | "joined";
export type InstanceState = "begun" | "finished" | "cancelled";

export interface Instance {
  id: number;
  initiator: Address;
  initiatorERC20: Address;
  initiatorAmount: number;
  counterParty: Address;
  counterPartyERC20: Address;
  counterPartyAmount: number;
  state: InstanceState;
}

export interface HomeActionState {
  swapName: string;
  swapFees: number;
  swapId: string;
  joined: {
    id: string;
    name: string;
    contractAddress: string;
  }[];
}

export interface DashboardState {
  pendingSwaps: Instance[];
  swapHistory: Instance[];
}

export type HomeActionStateDispatch = React.Dispatch<Partial<HomeActionState>>;

export interface SwapState {
  rates: string[];
  swapFee: string;
  initiator: SwapDetails;
  counterParty: SwapDetails;
}
export interface SwapDetails {
  userAddress: Address | null;
  tokenDetails: {
    address: Address | null;
    symbol: string | null;
    amount: number | null;
  };
}

export interface SignatureMessage {
  from: Address;
  to: Address;
  value: bigint;
  data: Address;
  gaslimit: bigint;
  nonce: bigint;
  deadline: bigint;
}

export interface CallPermit extends SignatureMessage {
  v: number;
  r: Address;
  s: Address;
}
