"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";

const SwapCollapse = () => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root
      className=" bg-[#1F2329] rounded-[5px] py-4 flex px-6 flex-col"
      open={open}
      onOpenChange={setOpen}
    >
      <div className=" flex justify-between w-full items-center">
        <p>ETH</p>

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

      <Collapsible.Content className=" flex flex-col ">
        {["BIT", "BIT"].map((item, i) => (
          <p className=" text-white pt-3">{item}</p>
        ))}
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default SwapCollapse;
