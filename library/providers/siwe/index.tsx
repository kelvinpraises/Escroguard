"use client";
import { SIWEConfig, SIWEProvider as _SIWEProvider } from "connectkit";
import React from "react";
import { SiweMessage } from "siwe";

const BACKEND_ADDR = process.env.NEXT_PUBLIC_BACKEND_SERVER_URL;

if (!BACKEND_ADDR) {
  throw new Error("Backend address environment variable is not defined.");
}

const siweConfig: SIWEConfig = {
  getNonce: async () => {
    return fetch(`${BACKEND_ADDR}/nonce`, { credentials: "include" }).then(
      (res) => res.text()
    );
  },
  createMessage: ({ nonce, address, chainId }) => {
    return new SiweMessage({
      version: "1",
      domain: window.location.host,
      uri: window.location.origin,
      address,
      chainId,
      nonce,
      statement: "Sign in with Ethereum to Dekan Capital.",
    }).prepareMessage();
  },
  verifyMessage: async ({ message, signature }) => {
    return fetch(`${BACKEND_ADDR}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
      credentials: "include",
    }).then((res) => {
      return res.ok;
    });
  },
  getSession: async () => {
    return fetch(`${BACKEND_ADDR}/session`, { credentials: "include" }).then(
      async (res) => {
        return res.ok ? res.json() : null;
      }
    );
  },
  signOut: async () => {
    return fetch(`${BACKEND_ADDR}/logout`, { credentials: "include" }).then(
      (res) => res.ok
    );
  },
};

const SIWEProvider = ({ children }: { children: React.ReactNode }) => {
  return <_SIWEProvider {...siweConfig}>{children}</_SIWEProvider>;
};

export default SIWEProvider;
