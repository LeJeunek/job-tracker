import { z } from "zod";

import { optionalDate } from "@/lib/validations";

export const contactSchema = z.object({
  applicationId: z.cuid(),
  name: z.string().trim().min(1, "Name is required").max(200),
  title: z.string().max(200).optional(),
  email: z.union([z.email("Must be a valid email"), z.literal("")]).optional(),
  phone: z.string().max(50).optional(),
  linkedin: z.union([z.url("Must be a valid URL"), z.literal("")]).optional(),
  notes: z.string().max(5000).optional(),
  followUp: optionalDate,
});

export type ContactInput = z.infer<typeof contactSchema>;
