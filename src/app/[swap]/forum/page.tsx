import Header from "@/components/Header";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className=" flex flex-col">
      <Header />

      <div className=" flex flex-col p-8 gap-8 h-[calc(100vh-124px)]">
        <div className=" flex items-center gap-4">
          <Link href={"/dashboard"}>
            <div className=" bg-[#F5F150] py-2 px-4 rounded-[5px]">
              <img src="/Arrow.svg" alt="" />
            </div>
          </Link>
          <p className=" text-[32px] font-semibold font-roboto">Forum</p>
        </div>

        <div className=" gap-8 h-full flex">
          <div className=" bg-[#1C1E23] py-6 px-4 flex flex-col min-w-[300px] gap-6 rounded-[10px] h-full">
            <p className=" px-6 text-[#9E9E9E] font-medium">ALL THREADS</p>
            <div className=" bg-[#1F2329] py-2 px-4 text-white font-medium text-xl">
              Main
            </div>
          </div>

          <div className=" flex flex-col justify-end gap-4 w-full">
            <div className=" bg-[#1F2329] px-6 h-[60px] rounded-[5px] flex items-center ">
              <input
                type="text"
                className=" w-full outline-none bg-[#1F2329] h-full"
                placeholder="Message Main"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
