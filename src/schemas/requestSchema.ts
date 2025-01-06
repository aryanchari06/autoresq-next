import { string, z } from "zod";

export const requestSchema = z.object({
  title: z.string(),
  description: z.string(),
});
