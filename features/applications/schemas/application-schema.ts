import { z } from "zod";

import { ApplicationStatus, Priority } from "@/lib/generated/prisma/enums";
import { optionalInt } from "@/lib/validations";

export const applicationSchema = z.object({
  title: z.string().trim().min(1, "Job title is required").max(200),
  companyName: z.string().trim().min(1, "Company is required").max(200),
  status: z.enum(ApplicationStatus),
  priority: z.enum(Priority),
  location: z.string().max(200).optional(),
  remote: z.boolean(),
  salaryMin: optionalInt,
  salaryMax: optionalInt,
  applicationUrl: z
    .union([z.url("Must be a valid URL"), z.literal("")])
    .optional(),
  source: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

export const moveApplicationSchema = z.object({
  id: z.cuid(),
  status: z.enum(ApplicationStatus),
  index: z.number().int().min(0),
});

export type MoveApplicationInput = z.infer<typeof moveApplicationSchema>;
