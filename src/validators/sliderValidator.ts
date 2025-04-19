import { z } from "zod";

export const sliderSchema = z.object({
  title: z.string().min(1),
  imageUrl: z.string().url(),
  description: z.string().optional(),
  link: z.string().url().optional(),
  isActive: z.boolean().optional(),
});
