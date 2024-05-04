"use client";
import { ConnectButton } from "../library/components/ConnectButton";
import HomeActions from "../library/components/HomeActions";
import useAuth from "../library/hooks/home/auth";
import usePolybase from "../library/hooks/polybase";
import { HomeAction } from "../library/type";
import { useState } from "react";

export default function Home() {
  const [action, setAction] = useState<HomeAction | null>(null);
  const polybase = usePolybase();
  const loggedIn = useAuth(polybase);

  return (
    <div className=" flex w-full items-start h-screen">
      <div className=" flex flex-col bg-white gap-[128px] p-8 h-full w-full">
        <p className=" text-black text-xl font-semibold">Escrøguard</p>
        <div className=" flex flex-col gap-[64px]">
          <div className=" flex flex-col gap-4 items-center">
            <p className=" text-[#292929] font-semibold text-5xl">
              Own your swaps!
            </p>
            <p className=" w-[726px] text-[#5B5B5B] text-xl text-center">
              Escrøguard puts you in the driver's seat, allowing you to take
              full control of your trades. Create streamlined trading experience
              while enjoying the peace of mind that comes with true ownership,
              Connect wallet to create, join and view previous swaps.
            </p>
          </div>
          <div className=" w-full flex flex-col items-center gap-4">
            <ConnectButton
              style={{
                display: !loggedIn ? "flex" : "none",
              }}
            />

            <div
              style={{
                display: loggedIn ? "flex" : "none",
              }}
              onClick={() => setAction("create")}
              className=" min-w-[530px] flex p-4 gap-4 items-center rounded-[5px] border-[2px] border-[#E0E0E0] cursor-pointer"
            >
              <img src="Plus.svg" alt="" />
              <div className=" flex flex-col gap-1">
                <p className=" text-[#292929] text-xl font-medium">
                  Create Swap
                </p>
                <p className=" text-[#5B5B5B] font-medium">
                  Create a new private swap space
                </p>
              </div>
            </div>
            <div
              style={{
                display: loggedIn ? "flex" : "none",
              }}
              onClick={() => setAction("join")}
              className=" min-w-[530px] flex p-4 gap-4 items-center rounded-[5px] border-[2px] border-[#E0E0E0] cursor-pointer"
            >
              <img src="Login.svg" alt="" />
              <div className=" flex flex-col gap-1">
                <p className=" text-[#292929] text-xl font-medium">
                  Join a Swap
                </p>
                <p className=" text-[#5B5B5B] font-medium">
                  Join a private swap space
                </p>
              </div>
            </div>
            <div
              style={{
                display: loggedIn ? "flex" : "none",
              }}
              onClick={() => setAction("joined")}
              className=" min-w-[530px] flex p-4 gap-4 items-center rounded-[5px] border-[2px] border-[#E0E0E0] cursor-pointer"
            >
              <img src="Swap.svg" alt="" />
              <div className=" flex flex-col gap-1">
                <p className=" text-[#292929] text-xl font-medium">
                  Joined Swaps
                </p>
                <p className=" text-[#5B5B5B] font-medium">
                  View all your joined swap spaces
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HomeActions action={action} />
    </div>
  );
}
