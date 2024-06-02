"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";

const TokenCollapsible = () => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root
      className=" flex flex-col gap-4 w-[700px]"
      open={open}
      onOpenChange={setOpen}
    >
      <div className=" flex justify-between">
        <p className=" text-white text-xl font-medium">Tokens list</p>

        <Collapsible.Trigger asChild>
          <button>
            {open ? (
              <img src="/Down.svg" alt="" />
            ) : (
              <img src="/Left.svg" alt="" />
            )}
          </button>
        </Collapsible.Trigger>
      </div>
      <Collapsible.Content>
        <div className=" bg-[#1F2329]  p-6 rounded-[5px] flex flex-col gap-6 justify-between ">
          <div className=" flex justify-between items-center w-full">
            <div className=" flex gap-2">
              <p className=" underline text-white">
              0xB754369b3a7C430d7E94c14f33c097C398a0caa5
              </p>
              <img src="/LookUp.svg" alt="" />
            </div>
            <p className=" font-roboto font-medium">USDC</p>
          </div>
          <div className=" flex gap-4 items-center">
            <div className=" w-[20px] h-[20px] bg-white" />
            <p className=" font-roboto font-medium">Pays a fee on swap</p>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default TokenCollapsible;
