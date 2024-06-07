"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useContext, useEffect } from "react";

import Loading from "@/components/atoms/Loading";
import { UserContext } from "@/providers/userAuthData";
import { magicClient } from "@/services/magic/magicClient";

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
    if (!magicClient) {
      throw new Error("Magic instance is not available");
    }
    let result = await magicClient.oauth.getRedirectResult();
    authenticateWithServer(result.magic.idToken);
  };

  // `loginWithCredential()` returns a didToken for the user logging in
  const finishEmailRedirectLogin = () => {
    if (!magicClient) {
      throw new Error("Magic instance is not available");
    }
    if (magicCredential) {
      magicClient.auth.loginWithCredential().then((didToken: string | null) => {
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

    if (!magicClient) {
      throw new Error("Magic instance is not available");
    }

    if (res.status === 200) {
      let data = await res.json();
      setUser(data.user);
      router.push("/");
    }
  };

  return <Loading />;
};

const CallbackWithSuspense = () => (
  <Suspense fallback={<Loading />}>
    <Callback />
  </Suspense>
);

export default CallbackWithSuspense;
