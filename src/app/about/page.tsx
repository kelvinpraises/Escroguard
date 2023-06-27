import Header from "@/components/Header";
import React from "react";

const page = () => {
  return (
    <div className=" flex flex-col">
      <Header />

      <div className=" flex flex-col p-8 gap-8 h-[calc(100vh-124px)]">
        <div className=" flex items-center gap-4">
          <div className=" bg-[#F5F150] py-2 px-4 rounded-[5px]">
            <img src="/Arrow.svg" alt="" />
          </div>
          <p className=" text-[32px] font-semibold font-roboto">About</p>
        </div>

        <div className=" flex flex-col gap-8">
          <div className=" flex gap-4 items-center">
            <p className=" text-white font-medium text-xl">Name:</p>
            <p className=" text-white font-medium">Swappy v1</p>
          </div>

          <div className=" flex gap-4 items-center">
            <p className=" text-white font-medium text-xl">Contract:</p>
            <div className=" text-white font-medium flex gap-2">
              <p>0xB754369b3a7C430d7E94c14f33c097C398a0caa5</p>
              <img src="/LookUp.svg" alt="" />
            </div>
          </div>

          <div className=" flex flex-col gap-4 max-w-[700px] w-full">
            <div className=" flex justify-between">
              <p className=" text-white text-xl">Members list</p>
              <img src="/Down.svg" alt="" />
            </div>

            <div className=" flex flex-col gap-8">
              <div className=" bg-[#1F2329] rounded-[5px] flex h-[60px] px-6 gap-4 items-center">
                <img src="/profile.svg" width={"40px"} alt="" />
                <p className=" font-medium text-white">0xB754369b3a7C...97C398a0caa5</p>
              </div>

              <div className=" bg-[#1F2329] rounded-[5px] flex h-[60px] px-6 justify-between items-center">
                <p className=" font-medium text-white">0xB754369b3a7C...97C398a0caa5</p>
                <button className=" text-[#ED7770] font-roboto font-medium">unverified</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
