import "server-only";

import { z } from "zod";

export const updateProfileResponseSchema = z.object({
  message: z.string(),
  user: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    role: z.string().min(1),
  }),
});

export type UpdateProfileResponse = z.infer<typeof updateProfileResponseSchema>;
