import { Chain } from "wagmi";

export const horizen = {
  id: 1663,
  name: "Horizen",
  network: "horizen",
  nativeCurrency: {
    decimals: 18,
    name: "testnet horizen",
    symbol: "tZEN",
  },
  rpcUrls: {
    default: { http: ["https://gobi-testnet.horizenlabs.io/ethv1"] },
    public: { http: ["https://gobi-testnet.horizenlabs.io/ethv1"] },
  },
  blockExplorers: {
    default: { name: "Gobi", url: "https://gobi-explorer.horizen.io" },
    gobi: { name: "Gobi", url: "https://gobi-explorer.horizen.io" },
  },
  testnet: true,
} as const satisfies Chain;

export const callPermitAbi = [
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint64",
        name: "gaslimit",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "dispatch",
    outputs: [
      {
        internalType: "bytes",
        name: "output",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const factoryAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerFeeAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePermille",
        type: "uint256",
      },
    ],
    name: "deploySwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "escroguardContracts",
    outputs: [
      {
        internalType: "contract SwapERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "findInstances",
    outputs: [
      {
        internalType: "contract SwapERC20[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const swapAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerFeeAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_ownerFeePermille",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InsufficientFee",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "InvalidState",
    type: "error",
  },
  {
    inputs: [],
    name: "TransferError",
    type: "error",
  },
  {
    inputs: [],
    name: "Unauthorized",
    type: "error",
  },
  {
    inputs: [],
    name: "UnsupportedERC20",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "counterParty",
        type: "address",
      },
    ],
    name: "Begun",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "Cancelled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "Finished",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "_newValue",
        type: "bool",
      },
    ],
    name: "NoOwnerFeeERC20Changed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_address",
        type: "address",
      },
    ],
    name: "OwnerFeeAddressChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "_feePermille",
        type: "uint256",
      },
    ],
    name: "OwnerFeePermilleChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Paused",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "Unpaused",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_erc20",
        type: "address",
      },
    ],
    name: "addERC20Support",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "initiatorERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initiatorAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "counterPartyERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "counterPartyAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "counterParty",
        type: "address",
      },
    ],
    name: "begin",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "cancel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "_token",
        type: "address",
      },
      {
        internalType: "bool",
        name: "_newValue",
        type: "bool",
      },
    ],
    name: "changeNoOwnerFeeERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "complete",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "counterPartyInstances",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        internalType: "address",
        name: "initiatorERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initiatorAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "counterParty",
        type: "address",
      },
      {
        internalType: "address",
        name: "counterPartyERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "counterPartyAmount",
        type: "uint256",
      },
      {
        internalType: "enum SwapERC20.State",
        name: "state",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "erc20s",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_addr",
        type: "address",
      },
    ],
    name: "findInstances",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "id",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "initiator",
            type: "address",
          },
          {
            internalType: "address",
            name: "initiatorERC20",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "initiatorAmount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "counterParty",
            type: "address",
          },
          {
            internalType: "address",
            name: "counterPartyERC20",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "counterPartyAmount",
            type: "uint256",
          },
          {
            internalType: "enum SwapERC20.State",
            name: "state",
            type: "uint8",
          },
        ],
        internalType: "struct SwapERC20.Instance[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSupportedErc20s",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "initiatorInstances",
    outputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "initiator",
        type: "address",
      },
      {
        internalType: "address",
        name: "initiatorERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "initiatorAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "counterParty",
        type: "address",
      },
      {
        internalType: "address",
        name: "counterPartyERC20",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "counterPartyAmount",
        type: "uint256",
      },
      {
        internalType: "enum SwapERC20.State",
        name: "state",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    name: "noOwnerFeeERC20s",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerFeeAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ownerFeePermille",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_ownerFeeAddress",
        type: "address",
      },
    ],
    name: "setOwnerFeeAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_ownerFeePermille",
        type: "uint256",
      },
    ],
    name: "setOwnerFeePermille",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    name: "supportedErc20s",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
