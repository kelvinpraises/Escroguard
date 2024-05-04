import { store } from "../store/store";
import { useEffect } from "react";
import { Address, useAccount } from "wagmi";
import { PolybaseType } from "./polybase";

const useAuth = (polybase: PolybaseType) => {
  const setUserId = store((state) => state.setUserId);
  const setAddress = store((state) => state.setUserAddress);

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const { login, logout, loggedIn } = polybase;

    if (isConnected && !loggedIn) {
      (async () => {
        console.log(1);
        const authState = await login();
        if (authState && authState.userId) {
          setUserId(authState.userId);
          setAddress(address as Address);
        }
      })();
    }

    if (!isConnected && loggedIn) {
      logout();
    }
  }, [isConnected, polybase]);

  return polybase.loggedIn;
};

export default useAuth;
