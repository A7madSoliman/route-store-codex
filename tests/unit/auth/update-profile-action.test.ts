// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { update, identity, updateIdentity } = vi.hoisted(() => ({ update: vi.fn(), identity: vi.fn(), updateIdentity: vi.fn() }));
vi.mock("@/lib/api/endpoints/protected/update-profile.server", () => ({ updateProfile: update, UpdateProfileApiError: class UpdateProfileApiError extends Error { constructor(readonly code: string) { super(code); this.name = "UpdateProfileApiError"; } } }));
vi.mock("@/lib/auth/session.server", () => ({ getSessionIdentity: identity, updateSessionIdentity: updateIdentity }));

import { updateProfileAction } from "@/features/account/profile/actions/update-profile.action";

function data(field: string, value: FormDataEntryValue | null): FormData {
  const form = new FormData(); form.set("field", field); if (value !== null) form.set("value", value); return form;
}

beforeEach(() => { update.mockReset(); update.mockResolvedValue({ message: "updated", user: { name: "Name", email: "email@example.test", role: "user" } }); identity.mockReset(); updateIdentity.mockReset(); identity.mockResolvedValue({ name: "Name", email: "email@example.test" }); });

describe("update profile action", () => {
  it("rejects unsupported, blank, and multi-field-shaped input locally", async () => {
    expect((await updateProfileAction({ status: "idle", field: "name", value: "" }, data("password", "x"))).status).toBe("error");
    expect((await updateProfileAction({ status: "idle", field: "name", value: "" }, data("name", "   "))).status).toBe("error");
    const multi = data("name", "Name"); multi.set("email", "other@example.test");
    expect((await updateProfileAction({ status: "idle", field: "name", value: "" }, multi)).status).toBe("success");
    expect(update).toHaveBeenLastCalledWith({ name: "Name" });
  });

  it("requires verified session identity before calling the endpoint", async () => {
    identity.mockResolvedValue(null);
    await expect(updateProfileAction({ status: "idle", field: "name", value: "" }, data("name", "Name"))).resolves.toMatchObject({ status: "identity-missing" });
    expect(update).not.toHaveBeenCalled();
  });

  it("reconciles verified name/email response fields into the session", async () => {
    update.mockResolvedValue({ message: "updated", user: { name: "New Name", email: "new@example.test", role: "user" } });
    await expect(updateProfileAction({ status: "idle", field: "email", value: "" }, data("email", "new@example.test"))).resolves.toMatchObject({ status: "success" });
    expect(updateIdentity).toHaveBeenCalledWith({ name: "New Name", email: "new@example.test" });
  });

  it("does not invent phone reconciliation", async () => {
    update.mockResolvedValue({ message: "updated", user: { name: "Name", email: "email@example.test", role: "user" } });
    await updateProfileAction({ status: "idle", field: "phone", value: "" }, data("phone", "01000000000"));
    expect(updateIdentity).not.toHaveBeenCalled();
  });
});
