import { z } from "zod";

import { optionalDate } from "@/lib/validations";

export const taskSchema = z.object({
  applicationId: z.cuid(),
  title: z.string().trim().min(1, "Title is required").max(200),
  dueDate: optionalDate,
});

export type TaskInput = z.infer<typeof taskSchema>;
