import React from "react";

const SpentCard = () => {
  return (
    <div className=" bg-[#1C1E23] p-6 flex flex-col gap-6 min-w-[342px] rounded-[14px] h-[480px]">
      <div className=" flex flex-col gap-2">
        <p className=" text-[#9E9E9E] font-medium">My Balance (TVL)</p>
        <p className=" text-[32px] font-semibold">$ 232.50</p>
      </div>
      <div>
        <p className=" text-[#9E9E9E] font-medium">All assets</p>
      </div>
    </div>
  );
};

export default SpentCard;
