// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { normalizeReturnToMock } = vi.hoisted(() => ({ normalizeReturnToMock: vi.fn((value: unknown) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/") }));
vi.mock("@/lib/auth/return-to.server", () => ({ normalizeReturnTo: normalizeReturnToMock }));
vi.mock("@/lib/api/endpoints/public/signup.server", () => ({ signUp: vi.fn() }));
vi.mock("@/lib/auth/session.server", () => ({ setSession: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/auth/session-codec.server", () => ({ SessionValidationError: class SessionValidationError extends Error {} }));
vi.mock("@/lib/env/server", () => ({ EnvironmentValidationError: class EnvironmentValidationError extends Error {} }));
import { signUpAction } from "@/features/auth/actions/sign-up.action";
import { signUp } from "@/lib/api/endpoints/public/signup.server";
import { parseSignUpFormData } from "@/features/auth/sign-up-form.schema.server";

describe("signup action", () => {
  it("returns a local mismatch without calling the endpoint", async () => {
    const data = new FormData();
    data.set("name", "Name"); data.set("email", "email@example.test"); data.set("phone", "1"); data.set("password", "one"); data.set("rePassword", "two");
    const state = await signUpAction({ status: "idle", name: "", email: "", phone: "" }, data);
    expect(state).toMatchObject({ status: "error" });
    expect(signUp).not.toHaveBeenCalled();
  });

  it("rejects whitespace-only input and preserves surrounding whitespace", () => {
    const blank = new FormData();
    for (const key of ["name", "email", "password", "rePassword", "phone"]) blank.set(key, "   ");
    expect(parseSignUpFormData(blank).success).toBe(false);
    const preserved = new FormData();
    preserved.set("name", " John "); preserved.set("email", " email@example.test "); preserved.set("phone", " 1 "); preserved.set("password", " p "); preserved.set("rePassword", " p ");
    expect(parseSignUpFormData(preserved)).toMatchObject({ success: true, data: { name: " John ", email: " email@example.test ", phone: " 1 " } });
  });

  it("returns account-created after expected session validation failure", async () => {
    vi.mocked(signUp).mockResolvedValueOnce({ token: "synthetic", user: { name: "Name", email: "email@example.test", role: "user" } });
    const { setSession } = await import("@/lib/auth/session.server");
    vi.mocked(setSession).mockRejectedValueOnce(new (await import("@/lib/auth/session-codec.server")).SessionValidationError());
    const data = new FormData();
    data.set("name", "Name"); data.set("email", "email@example.test"); data.set("phone", "1"); data.set("password", "same"); data.set("rePassword", "same");
    await expect(signUpAction({ status: "idle", name: "", email: "", phone: "" }, data)).resolves.toMatchObject({ status: "account-created", name: "Name", email: "email@example.test", phone: "1" });
  });

  it("revalidates a tampered submitted returnTo", async () => {
    vi.mocked(signUp).mockResolvedValueOnce({ token: "synthetic", user: { name: "Name", email: "email@example.test", role: "user" } });
    const data = new FormData();
    data.set("name", "Name"); data.set("email", "email@example.test"); data.set("phone", "1"); data.set("password", "same"); data.set("rePassword", "same"); data.set("returnTo", "//evil.example");
    await signUpAction({ status: "idle", name: "", email: "", phone: "" }, data);
    expect(normalizeReturnToMock).toHaveBeenLastCalledWith("//evil.example");
  });
});
