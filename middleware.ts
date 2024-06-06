import { TOKEN_NAME } from "@/utils/cookie";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     * 5. /fonts (custom fonts in /public)
     * 6. /icons (icon files in /public)
     * 7. /little-cute-cat-cartoon-character (cat cartoon character files in /public)
     * 8. /moustache (moustache files in /public)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+|fonts/|icons/|little-cute-cat-cartoon-character/|moustache/).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${rootDomain}`);
  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;
  const searchParams = req.nextUrl.searchParams.toString();
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${rootDomain}`;
  }

  // rewrite root application to `/onboard` folder
  if (hostname === "localhost:3000" || hostname === rootDomain) {
    return NextResponse.rewrite(
      new URL(`/onboard${path === "/" ? "" : path}`, req.url)
    );
  }

  // rewrite if there's a subdomain to `/dashboard` folder
  if (subdomain) {
    try {
      const cookieStore = cookies();
      const token = cookieStore.get(TOKEN_NAME);

      if (!token) {
        console.log("url.toString()");
        return NextResponse.redirect(new URL(`/`, req.url));
      }

      const c = jwt.verify(token.value, process.env.JWT_SECRET || "");

      console.log("cccccc");
      console.log(c);
      console.log("cccccc");

      return NextResponse.rewrite(
        new URL(`/dashboard${path === "/" ? "" : path}`, req.url)
      );
    } catch (error) {
      return NextResponse.redirect(new URL(`/onboard/`, req.url));
    }
  }
}
