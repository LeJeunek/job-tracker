import { z } from "zod";

export const interviewSchema = z.object({
  applicationId: z.cuid(),
  round: z.string().trim().min(1, "Round is required").max(200),
  scheduledFor: z.coerce.date().optional(),
  interviewer: z.string().max(200).optional(),
  location: z.string().max(200).optional(),
  notes: z.string().max(5000).optional(),
});

export type InterviewInput = z.infer<typeof interviewSchema>;
