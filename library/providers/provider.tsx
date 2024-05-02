"use client";
import React from "react";
import RainbowKitProvider from "./rainbowkit";
import WagmiProvider from "./wagmi";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <WagmiProvider>
      <RainbowKitProvider>{children}</RainbowKitProvider>
    </WagmiProvider>
  );
};

export default RootProvider;
