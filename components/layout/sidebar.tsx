import Link from "next/link";
import { Briefcase } from "lucide-react";

import { SidebarNav } from "@/components/layout/sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Briefcase className="size-5" />
          Job Tracker
        </Link>
      </div>
      <SidebarNav />
    </aside>
  );
}
