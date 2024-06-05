"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";

import Loading from "@/components/atoms/Loading";
import { UserContext } from "@/providers/userAuthData";
import { magic } from "@/services/magic";

const Callback = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams?.get("provider");
  const magicCredential = searchParams?.get("magic_credential");
  const [_, setUser] = useContext(UserContext);

  // The redirect contains a `provider` query param if the user is logging in with a social provider
  useEffect(() => {
    provider ? finishSocialLogin() : finishEmailRedirectLogin();
  }, [provider]);

  // `getRedirectResult()` returns an object with user data from Magic and the social provider
  const finishSocialLogin = async () => {
    if (!magic) {
      throw new Error("Magic instance is not available");
    }
    let result = await magic.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    if (!magic) {
      throw new Error("Magic instance is not available");
    }
    if (magicCredential) {
      magic.auth.loginWithCredential().then((didToken: string | null) => {
        didToken && authenticateWithServer(didToken);
      });
    }
  };

  // Send token to server to validate
  const authenticateWithServer = async (didToken: string) => {
    let res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + didToken,
      },
    });

    if (!magic) {
      throw new Error("Magic instance is not available");
    }

    if (res.status === 200) {
      // Set the UserContext to the now logged in user
      let userMetadata = await magic.user.getMetadata();
      setUser(userMetadata);
      router.push("/");
    }
  };

  return <Loading />;
};

export default Callback;
