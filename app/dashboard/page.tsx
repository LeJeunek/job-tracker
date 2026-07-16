import { PageHeader } from "@/components/shared/page-header";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeader
        title={`Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}`}
        description="An overview of your job search at a glance."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Applications", "Interviews", "Offers", "Response Rate"].map(
          (metric) => (
            <Card key={metric}>
              <CardHeader>
                <CardDescription>{metric}</CardDescription>
                <CardTitle className="text-3xl">—</CardTitle>
              </CardHeader>
            </Card>
          )
        )}
      </div>
      <p className="text-muted-foreground mt-6 text-sm">
        Metrics light up in Phase 7, once applications are flowing through the
        Kanban board.
      </p>
    </>
  );
}
