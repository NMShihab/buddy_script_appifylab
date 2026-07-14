import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, SessionData } from "@/lib/auth";

const protectedRoutes = ["/feed"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await getIronSession<SessionData>(
    await cookies(),
    sessionOptions
  );

  const isAuthenticated = !!session.userId;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/feed", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/feed/:path*", "/login", "/register"],
};
