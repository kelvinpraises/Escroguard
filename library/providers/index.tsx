"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import ConnectKitProvider from "./connectkit";
import UserAuthDataProvider from "./userAuthData";
import WagmiProvider from "./wagmi";

const queryClient = new QueryClient();

const RootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full">
      <WagmiProvider>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider>
            <UserAuthDataProvider>{children}</UserAuthDataProvider>
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
};

export default RootProvider;
