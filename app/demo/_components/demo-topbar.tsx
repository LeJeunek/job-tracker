import Link from "next/link";

import { DemoMobileNav } from "@/app/demo/_components/demo-mobile-nav";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function DemoTopbar() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <DemoMobileNav />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-3">
        <span className="text-muted-foreground hidden text-xs sm:inline">
          Live demo — sample data, nothing is saved
        </span>
        <ThemeToggle />
        <Button
          size="sm"
          nativeButton={false}
          render={<Link href="/sign-in" />}
        >
          Sign in with GitHub
        </Button>
      </div>
    </header>
  );
}
