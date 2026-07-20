import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const SESSION_COOKIE = "abreco_session";

function sessionToken(): string {
  return process.env.ADMIN_SESSION_TOKEN ?? "";
}

export function checkCredentials(email: string, password: string): boolean {
  const expectedEmail = (process.env.ADMIN_EMAIL ?? "").toLowerCase();
  const expectedPass = process.env.ADMIN_PASSWORD ?? "";
  return (
    expectedEmail.length > 0 &&
    expectedPass.length > 0 &&
    email.trim().toLowerCase() === expectedEmail &&
    password === expectedPass
  );
}

/** Server Component / Route Handler guard using the cookie store. */
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return !!token && token === sessionToken();
}

/** Edge middleware guard using the request object. */
export function isAuthedRequest(req: NextRequest): boolean {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  return !!token && token === sessionToken();
}

export function issuedToken(): string {
  return sessionToken();
}
