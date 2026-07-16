import { Users } from "lucide-react";

import { getApplicationOptions } from "@/features/applications/queries/get-application-options";
import { ContactsTable } from "@/features/contacts/components/contacts-table";
import { NewContactDialog } from "@/features/contacts/components/new-contact-dialog";
import { getContacts } from "@/features/contacts/queries/get-contacts";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Contacts" };

export default async function ContactsPage() {
  const user = await requireUser();
  const [contacts, applications] = await Promise.all([
    getContacts(user.id),
    getApplicationOptions(user.id),
  ]);

  return (
    <>
      <PageHeader
        title="Contacts"
        description="Recruiters, hiring managers, and referrals — your mini CRM."
      >
        <NewContactDialog applications={applications} />
      </PageHeader>
      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description={
            applications.length === 0
              ? "Add an application first, then attach contacts to it."
              : "Add your first contact and keep follow-ups on schedule."
          }
        />
      ) : (
        <ContactsTable contacts={contacts} />
      )}
    </>
  );
}
