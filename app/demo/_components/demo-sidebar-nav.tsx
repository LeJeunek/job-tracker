"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { demoNavItems } from "@/app/demo/_components/demo-nav-items";
import { cn } from "@/lib/utils";

export function DemoSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-2">
      {demoNavItems.map((item) => {
        const active =
          item.href === "/demo"
            ? pathname === "/demo"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
          >
            <item.icon className="size-4" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
