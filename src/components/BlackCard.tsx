"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const BlackCard = ({ img, name }: { img: string; name: string }) => {
  const pathname = usePathname();
  const cleanPath = pathname.split("#")[0].split("?")[0];
  const segments = cleanPath.split("/");
  const spaceId = segments[1];

  return (
    <Link href={`${spaceId}/${name}`}>
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
