import { MagicUserMetadata,  magicClient } from "@/services/magic";
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

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
  const [user, setUser] = useState<Partial<ExtendedMagicUserMetadata>>();

  // If isLoggedIn is true, set the UserContext with user data
  // Otherwise, redirect to /login and set UserContext to { user: null }
  useEffect(() => {
    if (!magicClient) {
      throw new Error("Magic instance is not available");
    }

    setUser({ loading: true });
    magicClient.user.isLoggedIn().then((isLoggedIn) => {
      if (!magicClient) {
        throw new Error("Magic instance is not available");
      }

      if (isLoggedIn) {
        magicClient.user.getMetadata().then((userData) => {
          return setUser(userData);
        });
      } else {
        setUser(undefined);
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
