"use client";

import { OAuthProvider } from "@magic-ext/oauth";
import { useState } from "react";

import { magic } from "@/services/magic";

const SocialLogins = () => {
  const providers: OAuthProvider[] = ["apple", "google", "facebook", "github"];
  const [isRedirecting, setIsRedirecting] = useState(false);

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
    <>
      <div className="or-login-with">Or login with</div>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <button
              type="submit"
              className="social-btn"
              onClick={() => {
                setIsRedirecting(true);
                handleLoginWithSocial(provider);
              }}
              key={provider}
              style={{ backgroundImage: `url(${provider}.png)` }}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          </div>
        );
      })}
      {isRedirecting && <div className="redirecting">Redirecting...</div>}
      <style jsx>{`
        .or-login-with {
          margin: 25px 0;
          font-size: 12px;
          text-align: center;
          color: gray;
        }
        .social-btn {
          cursor: pointer;
          border-radius: 50px;
          margin-bottom: 20px;
          border: 1px solid #8a8a8a;
          padding: 9px 24px 9px 35px;
          width: 80%;

          background-color: #fff;
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: 23% 50%;
        }
        .redirecting {
          color: gray;
          font-size: 12px;
          margin-bottom: 5px;
        }
      `}</style>
    </>
  );
};

export default SocialLogins;
