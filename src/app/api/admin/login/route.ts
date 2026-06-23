import { NextResponse } from "next/server";
import {
  createSessionToken,
  sessionCookie,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const password = body.password?.trim();
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  try {
    if (!verifyPassword(password)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: "Admin login is not configured" },
      { status: 503 },
    );
  }

  const token = createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie.name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: sessionCookie.maxAge,
  });
  return res;
}
