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
