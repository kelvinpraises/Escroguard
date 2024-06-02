"use client";

import React from "react";
import ConnectKitProvider from "./connectkit";
import WagmiProvider from "./wagmi";

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <WagmiProvider>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </WagmiProvider>
    </div>
  );
};

export default RootProvider;
