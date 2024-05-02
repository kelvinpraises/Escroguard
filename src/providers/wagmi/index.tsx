import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import React from "react";
import { moonbaseAlpha } from "wagmi/chains";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import RainbowKitProvider from "../rainbowkit";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [moonbaseAlpha],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
  projectId: "00ed1a865e5bf256fcf17b7eab1e0ce0",
});

const config = createConfig({
  autoConnect: false,
  publicClient,
  webSocketPublicClient,
  connectors,
});

const WagmiProvider = ({
  children: prevChildren,
}: {
  children: React.ReactNode;
}) => {
  const children = React.Children.toArray(prevChildren).map((child, index) => {
    // NOTE: Chains is passed into RainbowKitProvider
    if (React.isValidElement(child) && child.type === RainbowKitProvider) {
      const rainbowkitProvider = child as React.ReactElement<any>;

      return React.cloneElement(rainbowkitProvider, {
        index,
        children: React.cloneElement(
          rainbowkitProvider.props.children as React.ReactElement<any>,
          {
            chains: chains,
            children: rainbowkitProvider.props.children,
          }
        ),
      });
    }

    return child;
  });

  return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default WagmiProvider;
