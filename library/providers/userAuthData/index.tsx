import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

import { MagicUserMetadata, magicClient } from "@/services/magic/magicClient";
import { useRouter } from "next/navigation";

export type ExtendedMagicUserMetadata = MagicUserMetadata & {
  loading: boolean;
};

export const UserContext = createContext<
  [
    Partial<ExtendedMagicUserMetadata> | undefined,
    Dispatch<SetStateAction<Partial<ExtendedMagicUserMetadata> | undefined>>
  ]
>([undefined, () => {}]);

const UserAuthDataProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<Partial<ExtendedMagicUserMetadata>>();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    if (!magicClient) {
      throw new Error("Magic instance is not available");
    }

    setUser({ loading: true });

    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
        } else {
          setUser(undefined);
          router.push("/login");
        }
      });
  }, []);

  return (
    <UserContext.Provider value={[user, setUser]}>
      {children}
    </UserContext.Provider>
  );
};

export default UserAuthDataProvider;
