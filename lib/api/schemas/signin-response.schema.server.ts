import "server-only";
import { z } from "zod";
export const signinResponseSchema = z.object({
  token: z.string().min(1),
  user: z.object({
    name: z.string().min(1),
    email: z.string().min(1),
    role: z.string().min(1),
  }),
});
