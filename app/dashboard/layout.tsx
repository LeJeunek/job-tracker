import { requireUser } from "@/lib/session";

// Auth guard for every /dashboard route. The full layout (sidebar,
// navbar, command palette) lands in Phase 4.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <>{children}</>;
}
