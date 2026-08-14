import "server-only";

import type { ProfileField } from "@/features/account/profile/profile-state";

const fields = new Set<ProfileField>(["name", "email", "phone"]);

export function parseProfileFormData(formData: FormData):
  | { success: true; field: ProfileField; value: string }
  | { success: false; field: ProfileField; value: string; message: string } {
  const rawField = formData.get("field");
  const rawValue = formData.get("value");
  const field = typeof rawField === "string" && fields.has(rawField as ProfileField) ? rawField as ProfileField : "name";
  const value = typeof rawValue === "string" ? rawValue : "";
  if (typeof rawField !== "string" || !fields.has(rawField as ProfileField)) return { success: false, field, value, message: "This profile field is not supported." };
  if (typeof rawValue !== "string" || rawValue.trim().length === 0) return { success: false, field, value, message: "Enter a value before saving." };
  return { success: true, field, value: rawValue.trim() };
}
