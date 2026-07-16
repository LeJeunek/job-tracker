import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * Returns the signed-in user or redirects to /sign-in.
 * Use at the top of every protected page, query, and server action
 * so all data access is scoped by userId.
 */
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/sign-in");
  }
  return session.user;
}
