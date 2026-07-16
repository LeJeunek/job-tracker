import { requireUser } from "@/lib/session";
import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await requireUser();

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-8">
      <h1 className="text-2xl font-semibold">
        Welcome{user.name ? `, ${user.name}` : ""}
      </h1>
      <p className="text-muted-foreground">
        Signed in as {user.email}. The dashboard arrives in Phase 4.
      </p>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/sign-in" });
        }}
      >
        <Button variant="outline" type="submit">
          Sign out
        </Button>
      </form>
    </main>
  );
}
