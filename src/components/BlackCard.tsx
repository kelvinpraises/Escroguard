import React from "react";

const BlackCard = ({ img, name }: { img: string; name: string }) => {
  return (
    <div className=" flex min-w-[300px] h-[200px] bg-black gap-4 justify-center items-center rounded-[5px]">
      <img src={img} alt="" />
      <p className=" text-[32px] font-semibold font-roboto">{name}</p>
    </div>
  );
};

export default BlackCard;
