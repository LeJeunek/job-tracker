import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl">
      <Skeleton className="mb-4 h-8 w-32" />
      <Skeleton className="mb-2 h-8 w-72" />
      <Skeleton className="mb-6 h-4 w-96" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-48" />
          <Skeleton className="h-40" />
        </div>
        <Skeleton className="h-96" />
      </div>
    </div>
  );
}
