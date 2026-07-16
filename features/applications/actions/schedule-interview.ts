"use server";

import { revalidatePath } from "next/cache";
import { format } from "date-fns";

import { assertApplicationOwner } from "@/features/applications/queries/assert-application-owner";
import {
  interviewSchema,
  type InterviewInput,
} from "@/features/applications/schemas/interview-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function scheduleInterview(
  input: InterviewInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = interviewSchema.safeParse(input);
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

    const interview = await prisma.interview.create({
      data: {
        applicationId: application.id,
        round: data.round,
        scheduledFor: data.scheduledFor ?? null,
        interviewer: data.interviewer || null,
        location: data.location || null,
        notes: data.notes || null,
      },
    });

    await prisma.activity.create({
      data: {
        applicationId: application.id,
        type: "INTERVIEW",
        message: data.scheduledFor
          ? `${data.round} scheduled for ${format(data.scheduledFor, "PPp")}`
          : `${data.round} added`,
      },
    });

    revalidatePath("/dashboard/applications");
    return { success: true, data: { id: interview.id } };
  } catch {
    return { success: false, error: "Failed to schedule interview" };
  }
}
