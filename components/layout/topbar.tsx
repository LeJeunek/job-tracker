import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CommandPalette } from "@/components/layout/command-palette";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";

type TopbarProps = {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
};

export function Topbar({ user }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <MobileNav />
      <Breadcrumbs />
      <div className="ml-auto flex items-center gap-2">
        <CommandPalette />
        <ThemeToggle />
        <UserMenu name={user.name} email={user.email} image={user.image} />
      </div>
    </header>
  );
}
