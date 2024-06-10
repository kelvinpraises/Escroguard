import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { mainnet, sepolia, moonbaseAlpha } from "wagmi/chains";
import { magicWalletConnector } from "./connectors/magic";

export const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [mainnet, sepolia, moonbaseAlpha],
    connectors: [
      magicWalletConnector({
        apiKey: process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY || "",
      }),
    ],
    transports: {
      // RPC URL for each chain
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [moonbaseAlpha.id]: http(),
    },

    // Required API Keys
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",

    // Required App Info
    appName: "Escroguard",

    // Optional App Info
    appDescription: "Your App Description",
    appUrl: "https://family.co", // your app's url
    appIcon: "https://family.co/logo.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);
