// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  sealSessionToken,
  SessionValidationError,
  unsealSessionToken,
} from "@/lib/auth/session-codec.server";

const key = "A".repeat(43);
const otherKey = "B".repeat(43);
const now = 1_700_000_000_000;
const identity = { name: "Test User", email: "test@example.test" };

function segment(value: unknown): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function fixtureToken(exp = Math.floor(now / 1_000) + 3_600): string {
  return `${segment({ fixture: true })}.${segment({ exp })}.fixture-signature`;
}

describe("session codec", () => {
  it("seals and unseals a synthetic token with the v2 identity envelope", async () => {
    const token = fixtureToken();
    const sealed = await sealSessionToken(token, key, identity, now);
    expect(sealed.value.split(".")).toHaveLength(3);
    expect(sealed.value.startsWith("v2.")).toBe(true);
    await expect(unsealSessionToken(sealed.value, key, now)).resolves.toMatchObject({
      token,
      expiresAt: new Date(1_700_003_600_000),
      identity,
    });
  });

  it("uses a new random IV for each envelope", async () => {
    const token = fixtureToken();
    const first = await sealSessionToken(token, key, identity, now);
    const second = await sealSessionToken(token, key, identity, now);
    expect(first.value).not.toBe(second.value);
  });

  it.each([
    "",
    "not-a-jwt",
    "one.two",
    "one..three",
    "one.###.three",
  ])("rejects malformed token %s", async (token) => {
    await expect(sealSessionToken(token, key, identity, now)).rejects.toBeInstanceOf(SessionValidationError);
  });

  it.each([
    fixtureToken(Math.floor(now / 1_000)),
    fixtureToken(Math.floor(now / 1_000) - 1),
    `${segment({})}.${segment({ exp: "later" })}.fixture-signature`,
    `${segment({})}.${segment({}).slice(0, -1)}.fixture-signature`,
  ])("rejects a token without a usable future expiry", async (token) => {
    await expect(sealSessionToken(token, key, identity, now)).rejects.toBeInstanceOf(SessionValidationError);
  });

  it("rejects oversized tokens and invalid cookie material without diagnostics", async () => {
    const oversized = `${segment({})}.${segment({ exp: Math.floor(now / 1_000) + 3_600 })}.${"x".repeat(2_040)}`;
    await expect(sealSessionToken(oversized, key, identity, now)).rejects.toBeInstanceOf(SessionValidationError);
    await expect(unsealSessionToken("v2.one.two", key, now)).resolves.toBeNull();
    await expect(unsealSessionToken("v1.bad.bad", key, now)).resolves.toBeNull();
  });

  it("rejects tampering, wrong keys, bad IVs, and bad tags", async () => {
    const sealed = await sealSessionToken(fixtureToken(), key, identity, now);
    const [version, iv, ciphertext] = sealed.value.split(".");
    const last = ciphertext.at(-1) === "A" ? "B" : "A";
    const tampered = `${version}.${iv}.${ciphertext.slice(0, -1)}${last}`;
    await expect(unsealSessionToken(tampered, key, now)).resolves.toBeNull();
    await expect(unsealSessionToken(sealed.value, otherKey, now)).resolves.toBeNull();
    await expect(unsealSessionToken(`v1.${segment(new Uint8Array(11))}.${ciphertext}`, key, now)).resolves.toBeNull();
  });

  it("rejects decrypted payloads with unrecognized properties", async () => {
    const token = fixtureToken();
    const sealed = await sealSessionToken(token, key, identity, now);
    const [version, encodedIv] = sealed.value.split(".");
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      "raw",
      Buffer.from(key, "base64url"),
      "AES-GCM",
      false,
      ["encrypt"],
    );
    const plaintext = new TextEncoder().encode(JSON.stringify({ v: 2, t: token, i: identity, extra: true }));
    const ciphertext = new Uint8Array(
      await globalThis.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: Buffer.from(encodedIv, "base64url"),
        additionalData: new TextEncoder().encode("route-store-session:v2"),
          tagLength: 128,
        },
        cryptoKey,
        plaintext,
      ),
    );
    await expect(
      unsealSessionToken(`${version}.${encodedIv}.${Buffer.from(ciphertext).toString("base64url")}`, key, now),
    ).resolves.toBeNull();
  });
});
