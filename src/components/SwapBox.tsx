import React from "react";

const SwapBox = () => {
  return (
    <div className=" max-w-[450px] w-full p-8 flex flex-col gap-[64px]">
      {/* create swap */}
      {/* <p className=" text-white text-5xl">Create Swap</p>
      <div className=" flex flex-col gap-8">
        <div className=" flex flex-col gap-4">
          <SwapInfo name={"Swap name"} />
          <SwapInfo name={"Swap description"} />
        </div>
        <button className=" py-4 w-full text-white rounded-[5px] bg-black">
          CREATE
        </button>
      </div> */}

      {/* join swap */}
      {/* <p className=" text-white text-5xl">Join Swap</p>
      <div className=" flex flex-col gap-8">
        <div className=" flex flex-col gap-4">
          <SwapInfo name={"Swap ID"} />
        </div>
        <button className=" py-4 w-full text-white rounded-[5px] bg-black">
          Join
        </button>
      </div> */}

      {/* Joined swap */}
      <p className=" text-white text-5xl">Joined Swaps</p>
      <div className=" flex flex-col gap-8">
        {[{ name: "dele's swap", no: "0xB754369b3a7C...97C398a0caa5" }].map(
          (items, i) => (
            <div
              className=" flex gap-4 p-4 bg-black rounded-[5px] items-center"
              key={i}
            >
              <div className=" flex flex-col gap-4 w-min">
                <p className=" text-white font-normal text-xl">{items.name}</p>
                <p className=" text-white font-normal">{items.no}</p>
              </div>
              <button className=" w-full grid place-items-center">
                <img src="LookUp.svg" alt="" />
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SwapBox;

const SwapInfo = ({ name }: { name: string }) => (
  <div className=" flex flex-col gap-4">
    <p>{name}</p>
    <input
      type="text"
      className="  h-[60px] rounded-[5px] bg-[#1F2329] outline-none px-2"
    />
  </div>
);
