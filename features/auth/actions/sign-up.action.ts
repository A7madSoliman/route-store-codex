"use server";

import { redirect } from "next/navigation";
import { signUp, SignupApiError } from "@/lib/api/endpoints/public/signup.server";
import { parseSignUpFormData } from "@/features/auth/sign-up-form.schema.server";
import { initialSignUpState, type SignUpState } from "@/features/auth/sign-up-state";
import { normalizeReturnTo } from "@/lib/auth/return-to.server";
import { setSession } from "@/lib/auth/session.server";
import { SessionValidationError } from "@/lib/auth/session-codec.server";
import { EnvironmentValidationError } from "@/lib/env/server";

export async function signUpAction(previous: SignUpState, formData: FormData): Promise<SignUpState> {
  const parsed = parseSignUpFormData(formData);
  const returnTo = normalizeReturnTo(formData.get("returnTo"));
  if (!parsed.success) return { status: "error", name: parsed.name, email: parsed.email, phone: parsed.phone, message: parsed.message };
  const { name, email, phone, password, rePassword } = parsed.data;
  try {
    const result = await signUp({ name, email, password, rePassword, phone });
    try {
      await setSession(result.token, { name: result.user.name, email: result.user.email });
    } catch (error) {
      if (error instanceof SessionValidationError || error instanceof EnvironmentValidationError) {
        return { status: "account-created", name, email, phone, message: "Your account was created. Please sign in to continue." };
      }
      throw error;
    }
    redirect(returnTo);
  } catch (error) {
    if (error instanceof SignupApiError) {
      const message = error.code === "duplicate" ? "An account with these details already exists." : "We could not create your account. Please check your details and try again.";
      return { status: "error", name, email, phone, message };
    }
    throw error;
  }
  return initialSignUpState;
}
