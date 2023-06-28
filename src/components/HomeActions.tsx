"use client";
import useEscroguard from "@/hooks/escroguard";
import usePolybase from "@/hooks/polybase";
import { HomeAction } from "@/type";

const HomeActions = ({ action }: { action: HomeAction | null }) => {
  const polybase = usePolybase();
  const c = useEscroguard(polybase);

  return (
    <div className=" max-w-[450px] w-full p-8 flex flex-col gap-[64px]">
      {(() => {
        let item;
        switch (action) {
          case "create":
            item = (
              <>
                <p className=" text-white text-5xl">Join Swap</p>
                <div className=" flex flex-col gap-8">
                  <div className=" flex flex-col gap-4">
                    <ActionInput name={"Swap ID"} />
                  </div>
                  <button className=" py-4 w-full text-white rounded-[5px] bg-black">
                    Join
                  </button>
                </div>
              </>
            );
            break;

          case "join":
            item = (
              <>
                <p className=" text-white text-5xl">Create Swap</p>
                <div className=" flex flex-col gap-8">
                  <div className=" flex flex-col gap-4">
                    <ActionInput name={"Swap name"} />
                    <ActionInput name={"Swap fees"} />
                  </div>
                  <button className=" py-4 w-full text-white rounded-[5px] bg-black">
                    CREATE
                  </button>
                </div>
              </>
            );
            break;

          case "joined":
            item = (
              <>
                <p className=" text-white text-5xl">Joined Swaps</p>
                <div className=" flex flex-col gap-8">
                  {[
                    {
                      name: "dele's swap",
                      no: "0xB754369b3a7C...97C398a0caa5",
                    },
                  ].map((items, i) => (
                    <div
                      className=" flex gap-4 p-4 bg-black rounded-[5px] items-center"
                      key={i}
                    >
                      <div className=" flex flex-col gap-4 w-min">
                        <p className=" text-white font-normal text-xl">
                          {items.name}
                        </p>
                        <p className=" text-white font-normal">{items.no}</p>
                      </div>
                      <button className=" w-full grid place-items-center">
                        <img src="LookUp.svg" alt="" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            );
            break;

          default:
            item = <></>;
            break;
        }

        return item;
      })()}
    </div>
  );
};

export default HomeActions;

const ActionInput = ({ name }: { name: string }) => (
  <div className=" flex flex-col gap-4">
    <p>{name}</p>
    <input
      type="text"
      className="  h-[60px] rounded-[5px] bg-[#1F2329] outline-none px-2"
    />
  </div>
);
