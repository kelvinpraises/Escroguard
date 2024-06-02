"use client";
import {
  CheckIcon,
  ChevronDownIcon
} from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";
import React from "react";

const SelectDemo = () => (
  <Select.Root>
    <Select.Trigger
      className=" bg-[#1F2329] rounded-[5px] py-4 flex px-6 justify-between outline-none"
      aria-label="Food"
    >
      <Select.Value placeholder="Select...." />
      <img src="/Left.svg" alt="" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className=" bg-[#1F2329] rounded-[5px] py-4 flex px-6 flex-col">
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            <Select.Label className="px-6 text-xs mb-2">Currency</Select.Label>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-violet11 cursor-default">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem = React.forwardRef(
  ({ value, children }: { value: string; children: any }, forwardedRef) => {
    return (
      <Select.Item
        className=" outline-none py-2 px-6 cursor-pointer"
        value={value}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  }
);

export default SelectDemo;
