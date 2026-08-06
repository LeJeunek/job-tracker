import { DemoKanbanBoard } from "@/app/demo/_components/demo-kanban-board";
import { PageHeader } from "@/components/shared/page-header";
import { demoApplications } from "@/lib/demo-data";

export const metadata = { title: "Applications" };

export default function DemoApplicationsPage() {
  const applications = demoApplications;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="Applications"
        description={`${applications.length} application${
          applications.length === 1 ? "" : "s"
        } tracked`}
      />
      <DemoKanbanBoard applications={applications} />
    </div>
  );
}
