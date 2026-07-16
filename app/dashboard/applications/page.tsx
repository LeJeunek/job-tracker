import { Briefcase } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = { title: "Applications" };

export default function ApplicationsPage() {
  return (
    <>
      <PageHeader
        title="Applications"
        description="Your Kanban board of every application in flight."
      />
      <EmptyState
        icon={Briefcase}
        title="No applications yet"
        description="The Kanban board lands in Phase 5. Applications you add will move through columns from Wishlist to Offer."
      />
    </>
  );
}
