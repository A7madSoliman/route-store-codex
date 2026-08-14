// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { values, cookieStore, cookiesMock } = vi.hoisted(() => {
  const values = new Map<string, string>();
  const cookieStore = {
    get: vi.fn((name: string) => {
      const value = values.get(name);
      return value === undefined ? undefined : { name, value };
    }),
    set: vi.fn((name: string, value: string, options?: unknown) => {
      values.set(name, value);
      return options;
    }),
    delete: vi.fn((name: string) => values.delete(name)),
  };
  return { values, cookieStore, cookiesMock: vi.fn(async () => cookieStore) };
});

vi.mock("next/headers", () => ({ cookies: cookiesMock }));

import { clearSession, getSession, getSessionIdentity, getSessionToken, setSession } from "@/lib/auth/session.server";

const key = "A".repeat(43);
const now = Math.floor(Date.now() / 1_000) + 3_600;
const identity = { name: "Test User", email: "test@example.test" };

function fixtureToken(): string {
  const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ fixture: true })}.${encode({ exp: now })}.fixture-signature`;
}

beforeEach(() => {
  values.clear();
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
  vi.stubEnv("SESSION_ENCRYPTION_KEY", key);
  cookiesMock.mockClear();
  cookieStore.get.mockClear();
  cookieStore.set.mockClear();
  cookieStore.delete.mockClear();
});

describe("application session cookie", () => {
  it("returns null without a cookie and does not mutate during reads", async () => {
    await expect(getSession()).resolves.toBeNull();
    expect(cookieStore.set).not.toHaveBeenCalled();
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });

  it("writes the exact cookie contract and returns token-free session state", async () => {
    const token = fixtureToken();
    await setSession(token, identity);
    expect(cookieStore.set).toHaveBeenCalledOnce();
    const [name, value, options] = cookieStore.set.mock.calls[0];
    expect(name).toBe("route-store-session");
    expect(value).toMatch(/^v2\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/u);
    expect(options).toMatchObject({
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
    expect(options).toHaveProperty("expires");

    const session = await getSession();
    expect(session).toHaveProperty("expiresAt");
    expect(session).not.toHaveProperty("token");
    await expect(getSessionToken()).resolves.toBe(token);
    await expect(getSessionIdentity()).resolves.toEqual(identity);
  });

  it("uses Secure for HTTPS application origins", async () => {
    vi.stubEnv("APP_ORIGIN", "https://store.example.com");
    await setSession(fixtureToken(), identity);
    expect(cookieStore.set.mock.calls[0][2]).toMatchObject({ secure: true });
  });

  it("collapses malformed, expired, and tampered cookies to anonymous", async () => {
    values.set("route-store-session", "not-a-cookie");
    await expect(getSession()).resolves.toBeNull();
    await expect(getSessionToken()).resolves.toBeNull();
  });

  it("clears only the local application cookie", async () => {
    await setSession(fixtureToken(), identity);
    await clearSession();
    await expect(getSession()).resolves.toBeNull();
    expect(cookieStore.set).toHaveBeenCalledTimes(2);
    expect(cookieStore.set.mock.calls[1]).toMatchObject([
      "route-store-session",
      "",
      { expires: new Date(0), path: "/", httpOnly: true, sameSite: "lax", secure: false },
    ]);
    expect(cookieStore.delete).not.toHaveBeenCalled();
  });
});
