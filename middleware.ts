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

  // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
  let hostname = req.headers
    .get("host")!
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);

  // special case for Vercel preview deployment URLs
  if (
    hostname.includes("---") &&
    hostname.endsWith(`.${process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_SUFFIX}`)
  ) {
    hostname = `${hostname.split("---")[0]}.${
      process.env.NEXT_PUBLIC_ROOT_DOMAIN
    }`;
  }

  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  console.log("##########################################################");
  console.log(hostname);
  console.log("##########################################################");

  // rewrite root application to `/onboard` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(`/onboard${path === "/" ? "" : path}`, req.url)
    );
  }

  // Root domain from environment variable
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

  // Extract subdomain if exists
  const subdomain = hostname.endsWith(`.${rootDomain}`)
    ? hostname.replace(`.${rootDomain}`, "")
    : null;

  // Only rewrite if there's a subdomain to `/dashboard` folder
  if (subdomain) {
    return NextResponse.rewrite(
      new URL(`/dashboard${path === "/" ? "" : path}`, req.url)
    );
  }
}
