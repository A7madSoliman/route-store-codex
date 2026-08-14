export type ProfileField = "name" | "email" | "phone";

export type ProfileState = {
  status: "idle" | "success" | "error" | "identity-missing";
  field: ProfileField;
  value: string;
  message?: string;
};

export const profileSuccessMessage = "Your profile was updated.";
export const profileErrorMessage = "We could not update this profile field. Please try again.";
export const profileIdentityMissingMessage = "We could not load your verified profile. Please sign in again.";

export function initialProfileState(field: ProfileField, value: string): ProfileState {
  return { status: "idle", field, value };
}
