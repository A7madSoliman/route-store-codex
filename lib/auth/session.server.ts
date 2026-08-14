import "server-only";

import { cookies } from "next/headers";

import {
  sealSessionToken,
  unsealSessionToken,
  type SessionIdentity,
  type SessionMetadata,
} from "@/lib/auth/session-codec.server";
import { getServerEnvironment, getSessionEnvironment } from "@/lib/env/server";

const sessionCookieName = "route-store-session";

export type SessionState = SessionMetadata;

function cookieOptions(expires: Date) {
  return {
    expires,
    httpOnly: true,
    sameSite: "lax",
    secure: new URL(getServerEnvironment().appOrigin).protocol === "https:",
    path: "/",
  } as const;
}

async function readSession(): Promise<Readonly<{ token: string; expiresAt: Date; identity: SessionIdentity }> | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(sessionCookieName)?.value;
  return unsealSessionToken(value, getSessionEnvironment().sessionEncryptionKey);
}

export async function getSession(): Promise<SessionState | null> {
  const session = await readSession();
  return session ? Object.freeze({ expiresAt: session.expiresAt }) : null;
}

/** Internal server-only capability for protected transport. */
export async function getSessionToken(): Promise<string | null> {
  return (await readSession())?.token ?? null;
}

export async function getSessionIdentity(): Promise<SessionIdentity | null> {
  return (await readSession())?.identity ?? null;
}

export async function setSession(token: string, identity: SessionIdentity): Promise<void> {
  const sealed = await sealSessionToken(token, getSessionEnvironment().sessionEncryptionKey, identity);
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, sealed.value, cookieOptions(sealed.expiresAt));
}

export async function updateSessionIdentity(identity: SessionIdentity): Promise<void> {
  const current = await readSession();
  if (!current) return;
  await setSession(current.token, identity);
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(sessionCookieName, "", cookieOptions(new Date(0)));
}
