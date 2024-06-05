import { Magic } from "@magic-sdk/admin";
import { NextRequest, NextResponse } from "next/server";

// Initiating Magic instance for server-side methods
const magic = new Magic(process.env.MAGIC_SECRET_KEY);

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

    magic.token.validate(didToken);

    return NextResponse.json({ authenticated: true }, { status: 200 });
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
