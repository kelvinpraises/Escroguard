"use client";

import Link from "next/link";

import { UserContext } from "@/providers/userAuthData";
import { magic } from "@/services/magic";
import { useContext } from "react";
import Loading from "../atoms/Loading";
import EmailLogin from "./EmailLogin";

export const UserOnboard = () => {
  const [user, setUser] = useContext(UserContext);

  const options = [
    {
      href: "create",
      imgSrc: "Plus.svg",
      title: "Create Swap",
      description: "Create a new private swap space",
    },
    {
      href: "join",
      imgSrc: "Login.svg",
      title: "Join a Swap",
      description: "Join a private swap space",
    },
    {
      href: "joined",
      imgSrc: "Swap.svg",
      title: "Joined Swaps",
      description: "View all your joined swap spaces",
    },
  ];

  const logout = () => {
    if (!magic) {
      throw new Error("Magic instance is not available");
    }

    magic.user.logout().then(() => {
      setUser(undefined);
    });
  };
  return (
    <>
      {user?.loading ? (
        <Loading />
      ) : user?.issuer ? (
        <div className="w-full flex flex-col items-center gap-4">
          <>
            {options.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="min-w-[530px] flex p-4 gap-4 items-center rounded-[5px] border-2 border-[#E0E0E0] cursor-pointer"
              >
                <img src={action.imgSrc} alt={action.title} />
                <div className="flex flex-col items-start gap-1">
                  <p className="text-[#292929] text-xl font-medium">
                    {action.title}
                  </p>
                  <p className="text-[#5B5B5B] font-medium">
                    {action.description}
                  </p>
                </div>
              </Link>
            ))}
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
        <EmailLogin />
      )}
    </>
  );
};
