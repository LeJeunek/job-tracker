import { NotebookText } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = { title: "Snippets" };

export default function SnippetsPage() {
  return (
    <>
      <PageHeader
        title="Snippet Vault"
        description="Reusable answers, intros, and templates — one click to copy."
      />
      <EmptyState
        icon={NotebookText}
        title="No snippets yet"
        description="The vault opens in Phase 9 with markdown editing, tags, search, and favorites."
      />
    </>
  );
}
