import { SnippetDialog } from "@/features/snippets/components/snippet-dialog";
import { SnippetVault } from "@/features/snippets/components/snippet-vault";
import { getSnippets } from "@/features/snippets/queries/get-snippets";
import { PageHeader } from "@/components/shared/page-header";
import { requireUser } from "@/lib/session";

export const metadata = { title: "Snippets" };

export default async function SnippetsPage() {
  const user = await requireUser();
  const snippets = await getSnippets(user.id);

  return (
    <>
      <PageHeader
        title="Snippet Vault"
        description="Reusable answers, intros, and templates — one click to copy."
      >
        <SnippetDialog />
      </PageHeader>
      <SnippetVault snippets={snippets} />
    </>
  );
}
