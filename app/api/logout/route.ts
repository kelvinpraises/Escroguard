import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { magicAdmin } from "@/services/magic/magicAdmin";
import { MagicUserMetadata } from "@/services/magic/magicClient";
import { isDevelopment } from "@/utils";
import { TOKEN_NAME, removeTokenCookie } from "@/utils/cookie";
import { verifyJwtToken } from "@/utils/jwt";

/**
 * Clear the cookie with the JWT to log the user out
 * Log the user our of their session with Magic if it's still valid (valid for 7 days after initial login)
 * Redirect the user to /login
 */
export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME);

  try {
    if (!token) {
      return NextResponse.json(
        { error: "User is not logged in" },
        { status: 401 }
      );
    }

    let user = (await verifyJwtToken(
      token.value
    )) as unknown as MagicUserMetadata;

    removeTokenCookie();

    try {
      await magicAdmin.users.logoutByIssuer(user.issuer || "");
    } catch (error) {
      console.log("Users session with Magic already expired");
    }

    const protocol = isDevelopment ? "http" : "https";

    return NextResponse.redirect(
      new URL(
        `${protocol}://${
          process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
          process.env.NEXT_PUBLIC_VERCEL_ENV
        }`
      ),
      302
    );
  } catch (error) {
    // Ensure error is of type Error
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      // Handle unexpected error type
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      );
    }
  }
}
