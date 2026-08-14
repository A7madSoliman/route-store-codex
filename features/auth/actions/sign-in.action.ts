"use server";
import { redirect } from "next/navigation";
import { signIn, SigninApiError } from "@/lib/api/endpoints/public/signin.server";
import { parseSignInFormData } from "@/features/auth/sign-in-form.schema.server";
import { initialSignInState, type SignInState } from "@/features/auth/sign-in-state";
import { normalizeReturnTo } from "@/lib/auth/return-to.server";
import { setSession } from "@/lib/auth/session.server";
import { SessionValidationError } from "@/lib/auth/session-codec.server";
import { EnvironmentValidationError } from "@/lib/env/server";
export async function signInAction(previous: SignInState, formData: FormData): Promise<SignInState> {
  const parsed = parseSignInFormData(formData); const returnTo = normalizeReturnTo(formData.get("returnTo"));
  if (!parsed.success) return { status: "error", email: parsed.email, message: parsed.message };
  const { email, password } = parsed.data; let result: Awaited<ReturnType<typeof signIn>>;
  try { result = await signIn({ email, password }); } catch (error) { if (error instanceof SigninApiError) return { status: "error", email, message: error.code === "invalid-credentials" ? "Email or password is incorrect." : "We could not sign you in. Please try again." }; throw error; }
  try { await setSession(result.token, { name: result.user.name, email: result.user.email }); } catch (error) { if (error instanceof SessionValidationError || error instanceof EnvironmentValidationError) return { status: "error", email, message: "We couldn't start a secure session. Please try again." }; throw error; }
  redirect(returnTo); return initialSignInState;
}
