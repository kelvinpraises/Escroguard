import Header from "@/components/Header";
import Link from "next/link";
import React from "react";

const Swap = () => {
  return (
    <div className=" flex flex-col">
      <Header />
      <div className=" flex flex-col p-8 gap-8">
        <div className=" flex items-center gap-4">
          <Link href={"/dashboard"}>
            <div className=" bg-[#F5F150] py-2 px-4 rounded-[5px]">
              <img src="/Arrow.svg" alt="" />
            </div>
          </Link>
          <p className=" text-[32px] font-semibold font-roboto">Swap</p>
        </div>

        <div className=" flex p-6 flex-col gap-6 items-center">
          <div className=" max-w-[570px] w-full bg-[#1C1E23] rounded-[10px] flex flex-col p-8 gap-8">
            <div className=" flex flex-col gap-4">
              <p className="text-white text-xl font-medium">Counter party</p>
              <div className=" flex px-6 justify-between bg-[#1F2329] h-[60px]">
                <div className=" flex gap-4 items-center">
                  <img src="/profile.svg" width={"40px"} alt="" />
                  <p className=" text-white font-medium underline font-roboto">
                    0xB754369b3a7C...97C398a0caa5
                  </p>
                </div>
              </div>
            </div>
            <div className=" flex gap-8 items-start">
              <div className=" flex flex-col gap-8 w-[237px]">
                <p className=" text-white text-xl font-medium">You Send</p>
                <div className=" bg-[#1F2329] rounded-[5px] h-[60px] flex justify-between px-6 items-center">
                  <p>ETH</p>
                  <p>v</p>
                </div>
                <input
                  type="text"
                  className=" bg-[#1F2329] px-6 h-[60px] rounded-[5px] outline-none "
                />
              </div>
              <div className=" flex flex-col gap-8 w-[237px]">
                <p className=" text-white text-xl font-medium">You Receive</p>
                <div className=" bg-[#1F2329] rounded-[5px] h-[60px] flex justify-between px-6 items-center">
                  <p>ETH</p>
                  <p>v</p>
                </div>
                <input
                  type="text"
                  className=" bg-[#1F2329] px-6 h-[60px] rounded-[5px] outline-none"
                />
              </div>
            </div>
            <div className=" flex flex-col gap-6 p-6 bg-[#1F2329] rounded-[5px]">
              <div className=" flex justify-between">
                <p className=" text-[#9e9e9e] text-xl font-medium">Rate</p>
                <p className=" text-white text-xl font-medium">
                  0.001 ETH = 1 USDC
                </p>
              </div>
              <div className=" flex justify-between">
                <p className=" text-[#9e9e9e] text-xl font-medium">Swap Fee</p>
                <p className=" text-white text-xl font-medium">
                  0.2% @ 0.01 ETH
                </p>
              </div>
            </div>
            <button className=" bg-[#F5F150] py-4 rounded-[5px] flex gap-4 items-center justify-center">
              <img src="Swap.svg" alt="" />
              <p className=" text-black font-medium text-xl">SWAP TOKEN</p>
            </button>
          </div>
          <img
            src="/bg.png"
            className=" absolute left-1/2 transform -translate-x-1/2 z-[-1]"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Swap;
