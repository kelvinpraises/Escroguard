import { cookies } from "next/headers";
import { getHostname } from "..";
import { NextResponse } from "next/server";

export const TOKEN_NAME = "escroguard_auth_token";
const SESSION_LENGTH_IN_DAYS = parseInt(
  process.env.SESSION_LENGTH_IN_DAYS || "1",
  10
);
const SECONDS_IN_A_DAY = 60 * 60 * 24;
const MAX_AGE = SECONDS_IN_A_DAY * SESSION_LENGTH_IN_DAYS;

export function setTokenCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // if true, cookie will only be set if https (won't be set if http)
    path: "/",
    sameSite: "lax",
    domain:
      getHostname(
        `${
          process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
          process.env.NEXT_PUBLIC_VERCEL_ENV ||
          ""
        }`
      ) || "",
  });
}

export function removeTokenCookie() {
  const cookieStore = cookies();
  cookieStore.set(TOKEN_NAME, "", {
    maxAge: -1,
    domain:
      getHostname(
        `${
          process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
          process.env.NEXT_PUBLIC_VERCEL_ENV ||
          ""
        }`
      ) || "",
  });
}
