import { BigNumber } from "ethers";
import { Interface } from "ethers/lib/utils.js";

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;

  removed: boolean;

  address: string;
  data: string;

  topics: Array<string>;

  transactionHash: string;
  logIndex: number;
}

export interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string;
  transactionIndex: number;
  root?: string;
  gasUsed: BigNumber;
  logsBloom: string;
  blockHash: string;
  transactionHash: string;
  logs: Array<Log>;
  blockNumber: number;
  confirmations: number;
  cumulativeGasUsed: BigNumber;
  effectiveGasPrice: BigNumber;
  byzantium: boolean;
  type: number;
  status?: number;
}

export type StateDispatch<T> = React.Dispatch<React.SetStateAction<T>>;

export interface DeployProps {
  abi: Interface;
  args: { name: string; symbol: string };
  setContractAddress: StateDispatch<string | null>;
  setStage: StateDispatch<number>;
  setArgs: StateDispatch<{
    name: string;
    symbol: string;
  }>;
}

export type HomeAction = "create" | "join" | "joined";
