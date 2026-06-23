import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ck_admin_session";
const MAX_AGE_SEC = 60 * 60 * 24 * 7;

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const payload = `admin:${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;

  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = sign(payload);

  try {
    if (
      sig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
    ) {
      return false;
    }
  } catch {
    return false;
  }

  const exp = Number.parseInt(payload.split(":")[1] ?? "0", 10);
  return exp > Math.floor(Date.now() / 1000);
}

export function verifyPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD is not configured");
  }
  if (input.length !== password.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(password));
  } catch {
    return false;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;
  try {
    return verifySessionToken(token);
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export const sessionCookie = {
  name: COOKIE,
  maxAge: MAX_AGE_SEC,
};
