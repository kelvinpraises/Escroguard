import Link from "next/link";

import TokenCollapsible from "@/components/molecules/TokenCollapsible";

const Settings = () => {
  return (
    <div className=" flex flex-col">
      <div className=" flex flex-col p-8 gap-8">
        <div className=" flex items-center gap-4">
          <Link href={"/"}>
            <div className=" bg-[#F5F150] py-2 px-4 rounded-[5px]">
              <img src="/Arrow.svg" alt="" />
            </div>
          </Link>
          <p className=" text-[32px] font-semibold font-roboto">Settings</p>
        </div>

        <div className=" bg-[#1C1E23] p-8 gap-32 flex flex-col rounded-[10px]">
          <div className=" flex flex-col gap-8">
            <p className=" font-semibold text-[32px]">General</p>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">Swap name</p>
                <input
                  type="text"
                  className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none"
                />
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-black font-medium h-[60px]">
                Rename
              </button>
            </div>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">Swap ID</p>
                <input
                  type="text"
                  className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none"
                />
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-black font-medium h-[60px]">
                Copy
              </button>
            </div>

            <div className=" flex flex-col gap-4 w-[700px]">
              <p className=" text-white text-xl font-medium">Swap Contract</p>
              <div className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] flex justify-between items-center">
                <p className=" underline text-white">
                  0xB754369b3a7C430d7E94c14f33c097C398a0caa5
                </p>
                <img src="/LookUp.svg" alt="" />
              </div>
            </div>
          </div>

          <div className=" flex flex-col gap-8">
            <p className=" font-semibold text-[32px]">Members</p>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">
                  Add member address
                </p>
                <input
                  type="text"
                  className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none"
                />
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-black font-medium h-[60px]">
                Add
              </button>
            </div>
          </div>

          <div className=" flex flex-col gap-8">
            <p className=" font-semibold text-[32px]">Swap Contract</p>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">Fee Payment</p>
                <div className=" flex gap-4">
                  <input
                    type="text"
                    className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none w-full"
                    placeholder="Payment address"
                  />
                  <button className=" whitespace-nowrap px-6 bg-[#1F2329] rounded-[5px] flex items-center">
                    Swap fees in %
                  </button>
                </div>
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-black font-medium h-[60px]">
                Save
              </button>
            </div>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">
                  Add ERC20 token
                </p>
                <div className=" flex gap-4">
                  <input
                    type="text"
                    className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none w-full"
                    placeholder="Token address"
                  />
                  <button className=" whitespace-nowrap px-6 bg-[#1F2329] rounded-[5px] flex items-center">
                    Symbol e.g ETH
                  </button>
                </div>
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-black font-medium h-[60px]">
                Add
              </button>
            </div>
            <TokenCollapsible />
          </div>

          <div className=" flex flex-col gap-8">
            <p className=" font-semibold text-[32px]">Danger Zone</p>

            <div className=" flex items-end gap-4">
              <div className=" flex flex-col gap-4 w-[700px]">
                <p className=" text-white text-xl font-medium">
                  Transfer ownership
                </p>
                <input
                  type="text"
                  className=" bg-[#1F2329] h-[60px] px-6 rounded-[5px] outline-none"
                  placeholder="New owner address"
                />
              </div>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-[#F00] font-medium h-[60px] ">
                TRANSFER OWNERSHIP
              </button>
            </div>

            <div className=" flex flex-col gap-4">
              <p className=" text-white text-xl font-semibold font-roboto">
                Renounces ownership
              </p>
              <button className=" bg-[#F5F150] text-[20px] px-8 rounded-[5px] text-[#F00] font-medium h-[60px] w-min whitespace-nowrap">
                RENOUNCE OWNERSHIP
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
