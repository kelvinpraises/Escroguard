import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { magicAdmin } from "@/services/magic";
import { setTokenCookie } from "@/utils/cookie";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is missing" },
        { status: 401 }
      );
    }

    const didToken = authHeader.startsWith("Bearer ")
      ? authHeader.substr(7)
      : null;

    if (!didToken) {
      return NextResponse.json(
        { error: "Invalid Authorization header format" },
        { status: 401 }
      );
    }

    magicAdmin.token.validate(didToken);

    const metadata = await magicAdmin.users.getMetadataByToken(didToken);

    const SESSION_LENGTH_IN_DAYS = parseInt(
      process.env.SESSION_LENGTH_IN_DAYS || "1",
      10
    );

    let token = jwt.sign(
      {
        ...metadata,
        exp:
          Math.floor(Date.now() / 1000) + 60 * 60 * 24 * SESSION_LENGTH_IN_DAYS,
      },
      process.env.JWT_SECRET || ""
    );

    setTokenCookie(token);

    return NextResponse.json({ user: metadata }, { status: 200 });
  } catch (error: unknown) {
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
