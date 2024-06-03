// import { deserialize, writeContract } from "@wagmi/core";
// import { NextRequest, NextResponse } from "next/server";
// import { type Address } from "viem";

// import { callPermitAbi } from "@/data/constants";
// import { CallPermit } from "@/type";


// export async function POST(request: NextRequest) {
//   const json = deserialize(await request.text()) as CallPermit;
//   console.log(json);

//   const { hash } = await writeContract({
//     address: process.env.NEXT_PUBLIC_FACTORY as Address,
//     abi: callPermitAbi,
//     functionName: "dispatch",
//     args: [
//       json.from,
//       json.to,
//       json.value,
//       json.data,
//       json.gaslimit,
//       json.deadline,
//       json.v,
//       json.r,
//       json.s,
//     ],
//   });

//   let json_response = {
//     status: "success",
//   };

//   return new NextResponse(JSON.stringify(json_response), {
//     status: 200,
//     headers: { "Content-Type": "application/json" },
//   });
// }
