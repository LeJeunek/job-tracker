import { DemoSidebar } from "@/app/demo/_components/demo-sidebar";
import { DemoTopbar } from "@/app/demo/_components/demo-topbar";

export const metadata = { title: "Demo" };

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-svh w-full overflow-hidden">
      <DemoSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DemoTopbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
