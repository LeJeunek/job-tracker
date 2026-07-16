"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-16 text-center">
      <AlertTriangle className="text-destructive mb-3 size-10" />
      <h2 className="text-lg font-medium">Something went wrong</h2>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        {error.digest ? `Error reference: ${error.digest}` : error.message}
      </p>
      <Button className="mt-4" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
