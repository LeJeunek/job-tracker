"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { ActionResult } from "@/types";

const schema = z.object({ id: z.cuid() });

export async function markContacted(input: {
  id: string;
}): Promise<ActionResult<null>> {
  const user = await requireUser();

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  try {
    const contact = await prisma.contact.findFirst({
      where: { id: parsed.data.id, application: { userId: user.id } },
      select: { id: true, name: true, applicationId: true },
    });
    if (!contact) {
      return { success: false, error: "Contact not found" };
    }

    await prisma.$transaction([
      prisma.contact.update({
        where: { id: contact.id },
        data: { lastContacted: new Date() },
      }),
      prisma.activity.create({
        data: {
          applicationId: contact.applicationId,
          type: "CONTACT",
          message: `Contacted ${contact.name}`,
        },
      }),
    ]);

    revalidatePath("/dashboard/contacts");
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Failed to update contact" };
  }
}
