"use client";
import useStore from "@/store";
import { ellipsisAddress } from "@/utils";
import { useModal, useSIWE } from "connectkit";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

const CustomSIWEButton = () => {
  const [isClient, setIsClient] = useState(false);

  const { setOpen } = useModal();
  const { isConnected } = useAccount();

  const setAppActive = useStore((store) => store.setAppActive);
  const setUserAddress = useStore((store) => store.setUserAddress);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, isReady, isRejected, isLoading, isSignedIn, signOut, signIn } =
    useSIWE({
      onSignIn: (data) => {
        if (!data) return;
        const { address } = data;

        setUserAddress(address as Address);
        setAppActive(true);
      },
      onSignOut: () => {
        setAppActive(false);
      },
    });

  const handleSignIn = async () => {
    await signIn()?.then(() => {
      // Do something when signed in
    });
  };

  const handleSignOut = async () => {
    await signOut()?.then(() => {
      // Do something when signed out
    });
  };

  /** Wallet is connected and signed in */
  if (isSignedIn && isClient) {
    return (
      <button
        onClick={() => setOpen(true)}
        className=" bg-slate-900 text-white px-4 rounded-xl "
      >
        {ellipsisAddress(data?.address)}
      </button>
    );
  }

  /** Wallet is connected, but not signed in */
  if (isConnected && isClient) {
    return (
      <>
        <button
          className="bg-slate-900 text-white px-4 rounded-xl "
          onClick={handleSignIn}
          disabled={isLoading}
        >
          {isRejected // User Rejected
            ? "Try Again"
            : isLoading // Waiting for signing request
            ? "Awaiting request..."
            : // Waiting for interaction
              "Sign In"}
        </button>
      </>
    );
  }

  /** A wallet needs to be connected first */
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className=" bg-slate-900 text-white px-4 rounded-xl "
      >
        Connect Wallet
      </button>
    </>
  );
};

export default CustomSIWEButton;
