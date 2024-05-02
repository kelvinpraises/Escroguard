"use client";

import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { RowSpacingIcon, Cross2Icon } from "@radix-ui/react-icons";

const MembersCollapse = () => {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible.Root
      className=" flex flex-col gap-4 w-[700px]"
      open={open}
      onOpenChange={setOpen}
    >
      <div className=" flex justify-between">
        <p className=" text-white text-xl font-medium">Members list</p>

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
      <Collapsible.Content className=" flex flex-col gap-8">
        <div className=" bg-[#1F2329] px-6 py-4 rounded-[5px] flex gap-4 flex-col">
          <div className=" flex gap-4 items-center">
            <img src="/profile.svg" width={"40px"} alt="" />
            <p className=" underline text-white">
              0xB754369b3a7C...97C398a0caa5
            </p>
          </div>
        </div>
        <div className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] flex justify-between items-center">
          <p className=" underline text-white">0xB754369b3a7C...97C398a0caa5</p>
          <button className=" text-[#ED7770] font-medium font-roboto">
            unverified
          </button>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default MembersCollapse;
