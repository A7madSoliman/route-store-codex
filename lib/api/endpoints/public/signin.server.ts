import "server-only";
import { PublicApiError } from "@/lib/api/errors.server";
import { publicPostJson } from "@/lib/api/transport/public-request.server";
import { signinResponseSchema } from "@/lib/api/schemas/signin-response.schema.server";
export type SigninErrorCode = "invalid-credentials" | "rejected" | "unavailable" | "invalid-response" | "upstream-failure";
export class SigninApiError extends Error { constructor(readonly code: SigninErrorCode) { super("The sign-in request could not be completed safely."); this.name = "SigninApiError"; } }
export async function signIn(input: { email: string; password: string }): Promise<{
  token: string;
  user: { name: string; email: string; role: string };
}> {
  try { const response = await publicPostJson(["auth", "signin"], { email: input.email, password: input.password }); if (response.status === 401) throw new SigninApiError("invalid-credentials"); if (response.status >= 400 && response.status < 500) throw new SigninApiError("rejected"); if (response.status !== 200) throw new SigninApiError("upstream-failure"); const parsed = signinResponseSchema.safeParse(response.body); if (!parsed.success) throw new SigninApiError("invalid-response"); return parsed.data; }
  catch (error) { if (error instanceof SigninApiError) throw error; if (error instanceof PublicApiError || (typeof error === "object" && error !== null && "status" in error && "code" in error)) { const safeError = error as { status?: number; code?: string }; if (safeError.status === 401) throw new SigninApiError("invalid-credentials"); if (safeError.status && safeError.status >= 400 && safeError.status < 500) throw new SigninApiError("rejected"); if (safeError.code === "unavailable") throw new SigninApiError("unavailable"); if (safeError.code === "invalid-response") throw new SigninApiError("invalid-response"); } throw new SigninApiError("upstream-failure"); }
}
