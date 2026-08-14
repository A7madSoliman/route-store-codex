// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { requireSessionMock, redirectMock } = vi.hoisted(() => ({
  requireSessionMock: vi.fn(),
  redirectMock: vi.fn((path: string): never => { throw new Error(`REDIRECT:${path}`); }),
}));

vi.mock("@/lib/auth/require-session.server", () => ({
  requireSession: requireSessionMock,
  SessionRequiredError: class SessionRequiredError extends Error {},
}));
vi.mock("next/navigation", () => ({ redirect: redirectMock }));

import { SessionRequiredError } from "@/lib/auth/require-session.server";
import { buildProtectedSignInPath, requireProtectedRoute } from "@/lib/auth/protected-route.server";

beforeEach(() => {
  requireSessionMock.mockReset();
  redirectMock.mockClear();
  vi.stubEnv("ECOMMERCE_API_BASE_URL", "https://ecommerce.routemisr.com/api/v1");
  vi.stubEnv("APP_ORIGIN", "http://localhost:3000");
});

describe("protected route guard", () => {
  it("returns the token-free local session summary", async () => {
    const session = { expiresAt: new Date("2026-12-01T00:00:00.000Z") };
    requireSessionMock.mockResolvedValue(session);
    await expect(requireProtectedRoute("/products")).resolves.toEqual(session);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("redirects only expected session absence", async () => {
    requireSessionMock.mockRejectedValue(new SessionRequiredError());
    await expect(requireProtectedRoute("/products?sort=price")).rejects.toThrow("REDIRECT:/sign-in?returnTo=%2Fproducts%3Fsort%3Dprice");
  });

  it.each(["https://evil.example/", "//evil.example/path", "/products\\secret", "/products#fragment", "/products/../brands", "/products/%2e%2e/brands"])("delegates unsafe or unsupported candidate %s to the existing normalizer", (candidate) => {
    expect(buildProtectedSignInPath(candidate)).toBe("/sign-in?returnTo=%2F");
  });

  it("encodes the normalized destination exactly once", () => {
    const path = buildProtectedSignInPath("/products?sort=price");
    const parsed = new URL(path, "http://localhost:3000");
    expect(parsed.pathname).toBe("/sign-in");
    expect(parsed.searchParams.get("returnTo")).toBe("/products?sort=price");
    expect(path).not.toContain("%252F");
  });

  it("propagates unexpected session failures", async () => {
    const failure = new Error("session infrastructure failed");
    requireSessionMock.mockRejectedValue(failure);
    await expect(requireProtectedRoute("/products")).rejects.toBe(failure);
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("does not expose token or cookie data", async () => {
    requireSessionMock.mockResolvedValue({ expiresAt: new Date("2026-12-01T00:00:00.000Z") });
    const result = await requireProtectedRoute("/products");
    expect(result).not.toHaveProperty("token");
    expect(JSON.stringify(result)).not.toContain("eyJ");
    expect(buildProtectedSignInPath("/products")).not.toMatch(/cookie|token|eyJ/i);
  });

});
