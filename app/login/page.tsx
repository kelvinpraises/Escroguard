"use client";

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import EmailForm from "@/components/forms/EmailForm";
import { UserContext } from "@/providers/userAuthData";
import { magic } from "@/services/magic";
import { OAuthProvider } from "@magic-ext/oauth";

const Login = () => {
  const router = useRouter();
  const [disabled, setDisabled] = useState(false);
  const [user, setUser] = useContext(UserContext);

  // Redirect to /profile if the user is logged in
  useEffect(() => {
    user?.issuer && router.push("/profile");
  }, [user]);

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
        router.push("/");
      }
    } catch (error) {
      setDisabled(false); // re-enable login button - user may have requested to edit their email
      console.log(error);
    }
  }

  async function handleLoginWithSocial(provider: OAuthProvider) {
    try {
      if (!magic) {
        throw new Error("Magic instance is not available");
      }

      await magic.oauth.loginWithRedirect({
        provider, // google, apple, etc
        redirectURI: new URL("/callback", window.location.origin).href, // required redirect to finish social login
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login">
      <EmailForm disabled={disabled} onEmailSubmit={handleLoginWithEmail} />
      {/* <SocialLogins onSubmit={handleLoginWithSocial} /> */}
      <style jsx>{`
        .login {
          max-width: 20rem;
          margin: 40px auto 0;
          padding: 1rem;
          border: 1px solid #dfe1e5;
          border-radius: 4px;
          text-align: center;
          box-shadow: 0px 0px 6px 6px #f7f7f7;
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
};

export default Login;
