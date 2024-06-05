"use client";

import { useContext, useState } from "react";

import Loading from "@/components/atoms/Loading";
import EmailForm from "@/components/forms/EmailForm";
import ActionButton from "@/components/molecules/ActionButton";
import HomeActions from "@/components/organisms/HomeActions";
import { UserContext } from "@/providers/userAuthData";
import { magic } from "@/services/magic";
import { HomeAction } from "@/types";

export default function Home() {
  const [user, setUser] = useContext(UserContext);
  const [action, setAction] = useState<HomeAction | null>(null);
  const [disabled, setDisabled] = useState(false);

  const logout = () => {
    if (!magic) {
      throw new Error("Magic instance is not available");
    }

    magic.user.logout().then(() => {
      setUser(undefined);
    });
  };

  async function handleLoginWithEmail(email: string) {
    try {
      setDisabled(true); // disable login button to prevent multiple emails from being triggered

      if (!magic) {
        throw new Error("Magic instance is not available");
      }

      // Trigger Magic link to be sent to user
      let didToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL("/callback", window.location.origin).href, // optional redirect back to your app after magic link is clicked
      });

      // Validate didToken with server
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + didToken,
        },
      });

      if (res.status === 200) {
        // Set the UserContext to the now logged in user
        let userMetadata = await magic.user.getMetadata();
        setUser(userMetadata);
      }

      setDisabled(false); // re-enable login button - button might be active when logged out
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  return (
    <div className="flex w-full items-start h-screen">
      <div className="flex flex-col bg-white gap-24 p-8 h-full w-full">
        <p className="text-black text-xl font-semibold">Escrøguard</p>
        <div className="flex flex-col gap-16">
          <div className="flex flex-col gap-4 items-center">
            <p className="text-[#292929] font-semibold text-5xl">
              Own Your Swaps!
            </p>
            <p className="w-[726px] text-[#5B5B5B] text-xl text-center">
              Escrøguard puts you in the driver&apos;s seat, allowing you to
              take full control of your trades. Create a streamlined trading
              experience while enjoying the peace of mind that comes with true
              ownership. Connect your wallet to create, join, and view previous
              swaps.
            </p>
          </div>
          <>
            {user?.loading ? (
              <Loading />
            ) : user?.issuer ? (
              <div className="w-full flex flex-col items-center gap-4">
                <>
                  <ActionButton
                    onClick={() => setAction("create")}
                    imgSrc="Plus.svg"
                    title="Create Swap"
                    description="Create a new private swap space"
                  />
                  <ActionButton
                    onClick={() => setAction("join")}
                    imgSrc="Login.svg"
                    title="Join a Swap"
                    description="Join a private swap space"
                  />
                  <ActionButton
                    onClick={() => setAction("joined")}
                    imgSrc="Swap.svg"
                    title="Joined Swaps"
                    description="View all your joined swap spaces"
                  />
                </>
                <div className="text-black">
                  <div>Email</div>
                  <div>{user?.email}</div>

                  <div>User Id</div>
                  <div>{user?.issuer}</div>
                </div>
                <button className=" text-black" onClick={logout}>
                  logout
                </button>
              </div>
            ) : (
              <EmailForm
                disabled={disabled}
                onEmailSubmit={handleLoginWithEmail}
              />
            )}
          </>
        </div>
      </div>
      <HomeActions action={action} />
    </div>
  );
}
