import { getApplicationOptions } from "@/features/applications/queries/get-application-options";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { requireUser } from "@/lib/session";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const applications = await getApplicationOptions(user.id);

  return (
    <div className="flex h-svh w-full overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} applications={applications} />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
