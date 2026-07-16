"use server";

import { revalidatePath } from "next/cache";

import { assertApplicationOwner } from "@/features/applications/queries/assert-application-owner";
import {
  contactSchema,
  type ContactInput,
} from "@/features/contacts/schemas/contact-schema";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

export async function createContact(
  input: ContactInput
): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();

  const parsed = contactSchema.safeParse(input);
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

    const contact = await prisma.contact.create({
      data: {
        applicationId: application.id,
        name: data.name,
        title: data.title || null,
        email: data.email || null,
        phone: data.phone || null,
        linkedin: data.linkedin || null,
        notes: data.notes || null,
        followUp: data.followUp ?? null,
      },
    });

    await prisma.activity.create({
      data: {
        applicationId: application.id,
        type: "CONTACT",
        message: `Added contact ${data.name}`,
      },
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/applications/[id]", "page");
    revalidatePath("/dashboard/contacts");
    return { success: true, data: { id: contact.id } };
  } catch {
    return { success: false, error: "Failed to add contact" };
  }
}
