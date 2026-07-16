import { z } from "zod";

export const taskSchema = z.object({
  applicationId: z.cuid(),
  title: z.string().trim().min(1, "Title is required").max(200),
  dueDate: z.coerce.date().optional(),
});

export type TaskInput = z.infer<typeof taskSchema>;
