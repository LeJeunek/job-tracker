import { Settings } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Settings"
        description="Account and app preferences."
      />
      <EmptyState
        icon={Settings}
        title="Nothing to configure yet"
        description="Profile and preference settings arrive alongside the polish phase."
      />
    </>
  );
}
