import { NewApplicationDialog } from "@/features/applications/components/new-application-dialog";
import { getBoardApplications } from "@/features/applications/queries/get-board-applications";
import { KanbanBoard } from "@/features/kanban/components/kanban-board";
import { PageHeader } from "@/components/shared/page-header";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage() {
  const user = await requireUser();
  const applications = await getBoardApplications(user.id);

  return (
    <>
      <PageHeader
        title="Applications"
        description={`${applications.length} application${
          applications.length === 1 ? "" : "s"
        } tracked`}
      >
        <NewApplicationDialog />
      </PageHeader>
      <KanbanBoard applications={applications} />
    </>
  );
}
