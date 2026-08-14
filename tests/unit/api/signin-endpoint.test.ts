// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const { post } = vi.hoisted(() => ({ post: vi.fn() }));
vi.mock("@/lib/api/transport/public-request.server", () => ({ publicPostJson: post }));
import { signIn } from "@/lib/api/endpoints/public/signin.server";
beforeEach(() => post.mockReset());
describe("signin endpoint", () => { it("sends exact fields and extracts verified identity", async () => { const user = { name: "Test User", email: "e", role: "user" }; post.mockResolvedValue({ status: 200, body: { token: "synthetic", user } }); await expect(signIn({ email: "e", password: "p" })).resolves.toEqual({ token: "synthetic", user }); expect(post).toHaveBeenCalledWith(["auth", "signin"], { email: "e", password: "p" }); }); it.each([[401, "invalid-credentials"], [400, "rejected"], [302, "upstream-failure"], [500, "upstream-failure"]] as const)("maps status %s", async (status, code) => { post.mockResolvedValue({ status, body: null }); await expect(signIn({ email: "e", password: "p" })).rejects.toMatchObject({ code }); }); it("rejects empty token or identity", async () => { post.mockResolvedValue({ status: 200, body: { token: "" } }); await expect(signIn({ email: "e", password: "p" })).rejects.toMatchObject({ code: "invalid-response" }); }); });
