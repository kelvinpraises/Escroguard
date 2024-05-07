"use client";
import React from "react";
import ConnectKitProvider from "./connectkit";
import WagmiProvider from "./wagmi";
import SIWEProvider from "./siwe";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <WagmiProvider>
        <SIWEProvider>
          <ConnectKitProvider>{children}</ConnectKitProvider>
        </SIWEProvider>
      </WagmiProvider>
    </div>
  );
};

export default RootProvider;
