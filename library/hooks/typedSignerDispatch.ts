import { store } from "../store/store";
import { SignatureMessage } from "../type";
import { useState } from "react";
import { Address, hexToNumber } from "viem";
import { serialize, useSignTypedData } from "wagmi";

const useTypedSignerDispatch = ({
  to,
  data,
}: {
  to: Address;
  data: Address;
}) => {
  const userAddress = store((state) => state.userAddress);

  if (!userAddress) throw new Error("Instance error");

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const domain = {
    name: "Call Permit Precompile",
    version: "1",
    chainId: 1287,
    verifyingContract: "0x000000000000000000000000000000000000080a",
  } as const;

  const message: SignatureMessage = {
    from: userAddress,
    to,
    value: BigInt(0),
    data,
    gaslimit: BigInt(1000_000),
    nonce: BigInt(0), // TODO: get nonce
    deadline: BigInt(1698498147342), // TODO: better date,
  };

  const types = {
    CallPermit: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "data", type: "bytes" },
      { name: "gaslimit", type: "uint64" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  } as const;

  const typeData = useSignTypedData({
    domain,
    message,
    primaryType: "CallPermit",
    types,

    onSuccess(signature) {
      const r = signature.slice(0, 66);
      const s = `0x${signature.slice(66, 130)}`;
      const v = hexToNumber(`0x${signature.slice(130, 132)}`);

      (async () => {
        try {
          const { from, to, value, data, gaslimit, deadline } = message;
          const response = await fetch("/api/callpermit", {
            method: "POST",
            body: serialize({
              from,
              to,
              value,
              data,
              gaslimit,
              deadline,
              v,
              r,
              s,
            }),
          });
          setIsSuccess(true);
          setIsLoading(false);
          console.log(await response.json());
        } catch (error) {
          setIsSuccess(false);
          setIsLoading(false);
          setIsError(true);
          console.error(error);
        }
      })();
    },
    onError(err) {
      setIsLoading(false);
      alert("something went wrong");
      console.error(err);
    },
  });

  return { ...typeData, isError, isSuccess, isLoading };
};

export default useTypedSignerDispatch;

const sampleAPI = (x: any) => {};

// { data, isError, isLoading, isSuccess, signTypedData }
