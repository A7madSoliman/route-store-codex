import "server-only";

import { PublicApiError } from "@/lib/api/errors.server";
import { publicPostJson } from "@/lib/api/transport/public-request.server";
import { signupResponseSchema } from "@/lib/api/schemas/signup-response.schema.server";

export type SignupErrorCode = "duplicate" | "rejected" | "unavailable" | "invalid-response" | "upstream-failure";
export class SignupApiError extends Error {
  constructor(readonly code: SignupErrorCode) {
    super("The sign-up request could not be completed safely.");
    this.name = "SignupApiError";
  }
}

export async function signUp(input: { name: string; email: string; password: string; rePassword: string; phone: string }): Promise<{
  token: string;
  user: { name: string; email: string; role: string };
}> {
  try {
    const response = await publicPostJson(["auth", "signup"], {
      name: input.name,
      email: input.email,
      password: input.password,
      rePassword: input.rePassword,
      phone: input.phone,
    });
    if (response.status !== 201) throw new SignupApiError("upstream-failure");
    const parsed = signupResponseSchema.safeParse(response.body);
    if (!parsed.success) throw new SignupApiError("invalid-response");
    return parsed.data;
  } catch (error) {
    if (error instanceof SignupApiError) throw error;
    if (error instanceof PublicApiError) {
      if (error.status === 409) throw new SignupApiError("duplicate");
      if (error.status && error.status >= 400 && error.status < 500) throw new SignupApiError("rejected");
      if (error.code === "unavailable") throw new SignupApiError("unavailable");
      if (error.code === "invalid-response") throw new SignupApiError("invalid-response");
      throw new SignupApiError("upstream-failure");
    }
    throw new SignupApiError("upstream-failure");
  }
}
