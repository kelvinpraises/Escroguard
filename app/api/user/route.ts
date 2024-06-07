import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { MagicUserMetadata } from "@/services/magic/magicClient";
import { TOKEN_NAME, setTokenCookie } from "@/utils/cookie";
import { verifyJwtToken } from "@/utils/jwt";

/**
 * Verify then refresh JWT each time user sends a request to /api/user
 * so they only get logged out after SESSION_LENGTH_IN_DAYS of inactivity
 */
export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(TOKEN_NAME);

  try {
    if (!token) {
      return NextResponse.json(
        { error: "User is not logged in" },
        { status: 401 }
      );
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    let user = (await verifyJwtToken(
      token.value
    )) as unknown as MagicUserMetadata;

    const SESSION_LENGTH_IN_DAYS = parseInt(
      process.env.SESSION_LENGTH_IN_DAYS || "1",
      10
    );

    let newToken = jwt.sign(
      {
        ...user,
        exp:
          Math.floor(Date.now() / 1000) + 60 * 60 * 24 * SESSION_LENGTH_IN_DAYS,
      },
      process.env.JWT_SECRET || ""
    );

    setTokenCookie(newToken);

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
