// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { put } = vi.hoisted(() => ({ put: vi.fn() }));
vi.mock("@/lib/api/transport/protected-request.server", () => ({ protectedPutJson: put }));

import { UpdateProfileApiError, updateProfile } from "@/lib/api/endpoints/protected/update-profile.server";

beforeEach(() => put.mockReset());

describe("update profile endpoint", () => {
  it.each([
    ["name", { name: "Updated Name" }],
    ["email", { email: "updated@example.test" }],
    ["phone", { phone: "01000000000" }],
  ])("sends one approved %s field", async (_field, body) => {
    put.mockResolvedValue({ status: 200, body: { message: "updated", user: { name: "Name", email: "email@example.test", role: "user" } } });
    await expect(updateProfile(body as never)).resolves.toMatchObject({ user: { name: "Name", email: "email@example.test", role: "user" } });
    expect(put).toHaveBeenCalledWith(["users", "updateMe"], body);
  });

  it.each([[400, "invalid"], [401, "unauthorized"], [500, "failure"]] as const)("maps status %s safely", async (status, code) => {
    put.mockResolvedValue({ status, body: null });
    await expect(updateProfile({ name: "Name" })).rejects.toEqual(expect.objectContaining({ name: "UpdateProfileApiError", code }));
  });

  it("rejects malformed success without exposing upstream data", async () => {
    put.mockResolvedValue({ status: 200, body: { private: "response" } });
    await expect(updateProfile({ name: "Name" })).rejects.toBeInstanceOf(UpdateProfileApiError);
    await expect(updateProfile({ name: "Name" })).rejects.not.toHaveProperty("private");
  });
});
