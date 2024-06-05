
import React from "react";

const JoinedSwaps = () => {
  const joined: any[] = [];

  return (
    <div className="max-w-[450px] w-full p-8 flex flex-col gap-8">
      <p className="text-white text-5xl">Joined Swaps</p>
      <div className="flex flex-col gap-8">
        {joined.length ? (
          joined.map((item, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-black rounded-[5px] items-center"
            >
              <div className="flex flex-col gap-4 w-min">
                <p className="text-white font-normal text-xl">{item.name}</p>
                <p className="text-white font-normal">{item.contractAddress}</p>
              </div>
              <button className="w-full grid place-items-center">
                <img src="LookUp.svg" alt="Look Up" />
              </button>
            </div>
          ))
        ) : (
          <p className="text-white">You haven&apos;t joined a swap space yet</p>
        )}
      </div>
    </div>
  );
};

export default JoinedSwaps;
