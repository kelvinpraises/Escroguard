import React from "react";

const Transaction = ({
  name,
  wallet,
}: {
  name: string;
  wallet: { name: string; date: string; amount: string; status: string }[];
}) => {
  return (
    <div className=" flex flex-col gap-8">
      <p className=" text-[32px] font-semibold">{name}</p>
      {/* <div className=" flex justify-between items-center"></div> */}
      <div className=" grid grid-cols-[30%,30%,30%,10%] font-roboto">
        <p className=" text-[#9E9E9E] font-medium capitalize font-roboto">name</p>
        <p className=" text-[#9E9E9E] font-medium capitalize font-roboto">date</p>
        <p className=" text-[#9E9E9E] font-medium capitalize font-roboto">amount</p>
        <p className=" text-[#9E9E9E] font-medium capitalize font-roboto">status</p>
      </div>
      {wallet.map((item, i) => (
        <div className=" grid grid-cols-[30%,30%,30%,10%] font-roboto" key={i}>
          <p className=" font-medium capitalize">{item.name}</p>
          <p className=" font-medium capitalize">{item.date}</p>
          <p className=" font-medium capitalize">{item.amount}</p>
          <p className={`font-medium capitalize ${item.status === 'Withdraw' ? 'text-[#2BCC7E]' : 'text-[#ED7770]'} font-roboto`} >{item.status}</p>
        </div>
      ))}
    </div>
  );
};

export default Transaction;
