import { Users } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = { title: "Contacts" };

export default function ContactsPage() {
  return (
    <>
      <PageHeader
        title="Contacts"
        description="Recruiters, hiring managers, and referrals — your mini CRM."
      />
      <EmptyState
        icon={Users}
        title="No contacts yet"
        description="The CRM view arrives in Phase 8, with follow-ups, LinkedIn links, and interaction timelines."
      />
    </>
  );
}
