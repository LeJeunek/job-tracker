"use server";

import { revalidatePath } from "next/cache";

import { assertApplicationOwner } from "@/features/applications/queries/assert-application-owner";
import {
  taskSchema,
  type TaskInput,
} from "@/features/applications/schemas/task-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function addTask(
  input: TaskInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = taskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const data = parsed.data;

  try {
    const application = await assertApplicationOwner(
      user.id,
      data.applicationId
    );
    if (!application) {
      return { success: false, error: "Application not found" };
    }

    const task = await prisma.task.create({
      data: {
        applicationId: application.id,
        title: data.title,
        dueDate: data.dueDate ?? null,
      },
    });

    await prisma.activity.create({
      data: {
        applicationId: application.id,
        type: "TASK",
        message: `Added task: ${data.title}`,
      },
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/applications/[id]", "page");
    return { success: true, data: { id: task.id } };
  } catch {
    return { success: false, error: "Failed to add task" };
  }
}

export async function toggleTask(input: {
  id: string;
  completed: boolean;
}): Promise<ActionResult<null>> {
  const user = await requireUser();

  try {
    const updated = await prisma.task.updateMany({
      where: { id: input.id, application: { userId: user.id } },
      data: { completed: input.completed },
    });
    if (updated.count === 0) {
      return { success: false, error: "Task not found" };
    }

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/applications/[id]", "page");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update task" };
  }
}
