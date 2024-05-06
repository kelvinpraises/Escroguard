"use client";
import useHomeActions from "../hooks/homeActions";
import { HomeAction } from "../type";

const HomeActions = ({ action }: { action: HomeAction | null }) => {
  // const {
  //   values,
  //   updateValues,
  //   joinSwap,
  //   deploySwap,
  //   isLoading,
  //   setIsLoading,
  // } = useHomeActions();

  return (
    <div className=" max-w-[450px] w-full p-8 flex flex-col gap-[64px]">
      {(() => {
        let item;
        switch (action) {
          case "create":
            item = (
              <>
                <p className=" text-white text-5xl">Create Swap</p>
                <div className=" flex flex-col gap-8">
                  <div className=" flex flex-col gap-4">
                    <p>Swap name</p>
                    <input
                      type="text"
                      className="  h-[60px] rounded-[5px] bg-[#1F2329] outline-none px-2"
                      value={values.swapName}
                      onChange={(e) =>
                        updateValues({ swapName: e.target.value })
                      }
                    />
                    <p>Swap fees</p>
                    <input
                      type="text"
                      className="  h-[60px] rounded-[5px] bg-[#1F2329] outline-none px-2"
                      value={values.swapFees}
                      onChange={(e) =>
                        updateValues({ swapFees: e.target.value })
                      }
                    />
                  </div>
                  <button
                    disabled={!deploySwap || isLoading}
                    onClick={() => {
                      deploySwap?.();
                      setIsLoading(true);
                    }}
                    className=" py-4 w-full text-white rounded-[5px] bg-black"
                  >
                    {isLoading ? "CREATING..." : "CREATE"}
                  </button>
                </div>
              </>
            );
            break;

          case "join":
            item = (
              <>
                <p className=" text-white text-5xl">Join Swap</p>
                <div className=" flex flex-col gap-8">
                  <div className=" flex flex-col gap-4">
                    <div className=" flex flex-col gap-4">
                      <p>Swap ID</p>
                      <input
                        type="text"
                        className="  h-[60px] rounded-[5px] bg-[#1F2329] outline-none px-2"
                        value={values.swapId}
                        onChange={(e) =>
                          updateValues({ swapId: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => joinSwap(values.swapId)}
                    className=" py-4 w-full text-white rounded-[5px] bg-black"
                  >
                    Join
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
                  {values.joined.length > 0 ? (
                    values.joined.map((items, i) => (
                      <div
                        className=" flex gap-4 p-4 bg-black rounded-[5px] items-center"
                        key={i}
                      >
                        <div className=" flex flex-col gap-4 w-min">
                          <p className=" text-white font-normal text-xl">
                            {items.name}
                          </p>
                          <p className=" text-white font-normal">
                            {items.contractAddress}
                          </p>
                        </div>
                        <button className=" w-full grid place-items-center">
                          <img src="LookUp.svg" alt="" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <>You haven't joined a swap space yet</>
                  )}
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
