"use server";

import { updateProfile, UpdateProfileApiError } from "@/lib/api/endpoints/protected/update-profile.server";
import { getSessionIdentity, updateSessionIdentity } from "@/lib/auth/session.server";
import { parseProfileFormData } from "@/features/account/profile/profile-form.schema.server";
import { profileErrorMessage, profileIdentityMissingMessage, profileSuccessMessage, type ProfileState } from "@/features/account/profile/profile-state";

export async function updateProfileAction(_previous: ProfileState, formData: FormData): Promise<ProfileState> {
  const parsed = parseProfileFormData(formData);
  if (!parsed.success) return { status: "error", field: parsed.field, value: parsed.value, message: parsed.message };
  if (!(await getSessionIdentity())) return { status: "identity-missing", field: parsed.field, value: parsed.value, message: profileIdentityMissingMessage };
  try {
    const response = await updateProfile(parsed.field === "name" ? { name: parsed.value } : parsed.field === "email" ? { email: parsed.value } : { phone: parsed.value });
    if (parsed.field === "name" || parsed.field === "email") await updateSessionIdentity({ name: response.user.name, email: response.user.email });
    return { status: "success", field: parsed.field, value: parsed.value, message: profileSuccessMessage };
  } catch (error) {
    if (error instanceof UpdateProfileApiError) {
      return { status: "error", field: parsed.field, value: parsed.value, message: error.code === "unauthorized" ? "Your session has expired. Please sign in again." : profileErrorMessage };
    }
    throw error;
  }
}
