import "server-only";

import { ProtectedApiError } from "@/lib/api/errors.server";
import { protectedPutJson } from "@/lib/api/transport/protected-request.server";
import { updateProfileResponseSchema, type UpdateProfileResponse } from "@/lib/api/schemas/update-profile-response.schema.server";

export type ProfileUpdate =
  | { name: string }
  | { email: string }
  | { phone: string };

export class UpdateProfileApiError extends Error {
  constructor(readonly code: "unauthorized" | "invalid" | "unavailable" | "failure") {
    super("The profile update could not be completed safely.");
    this.name = "UpdateProfileApiError";
  }
}

export async function updateProfile(input: ProfileUpdate): Promise<UpdateProfileResponse> {
  try {
    const response = await protectedPutJson(["users", "updateMe"], input);
    if (response.status === 401) throw new UpdateProfileApiError("unauthorized");
    if (response.status === 400) throw new UpdateProfileApiError("invalid");
    if (response.status !== 200) throw new UpdateProfileApiError("failure");
    const parsed = updateProfileResponseSchema.safeParse(response.body);
    if (!parsed.success) throw new UpdateProfileApiError("failure");
    return parsed.data;
  } catch (error) {
    if (error instanceof UpdateProfileApiError) throw error;
    if (error instanceof ProtectedApiError) {
      throw new UpdateProfileApiError(error.code === "unavailable" ? "unavailable" : "failure");
    }
    throw new UpdateProfileApiError("failure");
  }
}
