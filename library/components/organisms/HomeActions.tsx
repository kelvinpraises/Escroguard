"use client";

import useHomeActions from "@/hooks/homeActions";
import { HomeAction } from "../../type";
import Input from "../atoms/Input";

interface HomeActionsProps {
  action: HomeAction | null;
}

const HomeActions = ({ action }: HomeActionsProps) => {
  const { values, updateValues, joinSwap } = useHomeActions();

  const renderContent = () => {
    switch (action) {
      case "create":
        return (
          <>
            <p className="text-white text-5xl">Create Swap</p>
            <div className="flex flex-col gap-8">
              <Input
                label="Swap name"
                value={values.swapName}
                onChange={(e) => updateValues({ swapName: e.target.value })}
              />
              <Input
                type="number"
                label="Swap fees"
                value={values.swapFees.toString()}
                onChange={(e) =>
                  updateValues({ swapFees: parseFloat(e.target.value) })
                }
              />
              <button className="py-4 w-full text-white rounded-[5px] bg-black">
                Create Private Swap
              </button>
            </div>
          </>
        );

      case "join":
        return (
          <>
            <p className="text-white text-5xl">Join Swap</p>
            <div className="flex flex-col gap-8">
              <Input
                label="Swap ID"
                value={values.swapId}
                onChange={(e) => updateValues({ swapId: e.target.value })}
              />
              <button
                onClick={() => joinSwap(values.swapId)}
                className="py-4 w-full text-white rounded-[5px] bg-black"
              >
                Request Swap Access
              </button>
            </div>
          </>
        );

      case "joined":
        return (
          <>
            <p className="text-white text-5xl">Joined Swaps</p>
            <div className="flex flex-col gap-8">
              {values.joined.length ? (
                values.joined.map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 bg-black rounded-[5px] items-center"
                  >
                    <div className="flex flex-col gap-4 w-min">
                      <p className="text-white font-normal text-xl">
                        {item.name}
                      </p>
                      <p className="text-white font-normal">
                        {item.contractAddress}
                      </p>
                    </div>
                    <button className="w-full grid place-items-center">
                      <img src="LookUp.svg" alt="Look Up" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-white">
                  You haven't joined a swap space yet
                </p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-[450px] w-full p-8 flex flex-col gap-16">
      {renderContent()}
    </div>
  );
};

export default HomeActions;
