import Link from "next/link";
import React from "react";

const BlackCard = ({ img, name }: { img: string; name: string }) => {
  return (
    <Link href={`/dashboard/${name}`}>
      <div className=" flex min-w-[300px] h-[200px] bg-black gap-4 justify-center items-center rounded-[5px]">
        <img src={img} alt="" />
        <p className=" text-[32px] font-semibold font-roboto capitalize">
          {name}
        </p>
      </div>
    </Link>
  );
};

export default BlackCard;
