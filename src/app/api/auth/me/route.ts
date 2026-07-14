import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getIronSession<SessionData>(
      await cookies(),
      sessionOptions
    );

    if (!session.userId) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: session.userId,
        email: session.email,
        firstName: session.firstName,
        lastName: session.lastName,
        avatarUrl: session.avatarUrl,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
