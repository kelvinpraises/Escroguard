"use client";

import { useState } from "react";

import ActionCard from "@/components/molecules/ActionCard";
import HomeActions from "@/components/organisms/HomeActions";
import { HomeAction } from "@/types";

export default function Home() {
  const [action, setAction] = useState<HomeAction | null>(null);
  const loggedIn = true;

  return (
    <div className="flex w-full items-start h-screen">
      <div className="flex flex-col bg-white gap-24 p-8 h-full w-full">
        <p className="text-black text-xl font-semibold">Escrøguard</p>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[#292929] font-semibold text-5xl">
              Own Your Swaps!
            </p>
            <p className="w-[726px] text-[#5B5B5B] text-xl text-center">
              Escrøguard puts you in the driver&apos;s seat, allowing you to take
              full control of your trades. Create a streamlined trading
              experience while enjoying the peace of mind that comes with true
              ownership. Connect your wallet to create, join, and view previous
              swaps.
            </p>
          </div>
          <div className="w-full flex flex-col items-center gap-4">
            {!loggedIn ? (
              <button>Login</button>
            ) : (
              <>
                <ActionCard
                  onClick={() => setAction("create")}
                  imgSrc="Plus.svg"
                  title="Create Swap"
                  description="Create a new private swap space"
                />
                <ActionCard
                  onClick={() => setAction("join")}
                  imgSrc="Login.svg"
                  title="Join a Swap"
                  description="Join a private swap space"
                />
                <ActionCard
                  onClick={() => setAction("joined")}
                  imgSrc="Swap.svg"
                  title="Joined Swaps"
                  description="View all your joined swap spaces"
                />
              </>
            )}
          </div>
        </div>
      </div>
      <HomeActions action={action} />
    </div>
  );
}
