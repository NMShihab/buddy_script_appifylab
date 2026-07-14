import { SessionOptions } from "iron-session";

export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "buddy-script-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
