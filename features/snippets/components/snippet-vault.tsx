"use client";

import { useMemo, useState } from "react";
import { NotebookText, Search } from "lucide-react";

import { CATEGORY_LABELS } from "@/features/snippets/categories";
import { SnippetCard } from "@/features/snippets/components/snippet-card";
import type { SnippetRow } from "@/features/snippets/queries/get-snippets";
import { EmptyState } from "@/components/shared/empty-state";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FILTER_ITEMS = { ALL: "All categories", ...CATEGORY_LABELS };

export function SnippetVault({ snippets }: { snippets: SnippetRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return snippets.filter((snippet) => {
      if (category !== "ALL" && snippet.category !== category) return false;
      if (!q) return true;
      return (
        snippet.title.toLowerCase().includes(q) ||
        snippet.content.toLowerCase().includes(q) ||
        snippet.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [snippets, query, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-48 flex-1">
          <Search className="text-muted-foreground absolute left-2.5 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, content, tags…"
            className="pl-8"
          />
        </div>
        <Select
          value={category}
          onValueChange={(value) => setCategory(value ?? "ALL")}
          items={FILTER_ITEMS}
        >
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(FILTER_ITEMS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          icon={NotebookText}
          title={snippets.length === 0 ? "No snippets yet" : "No matches"}
          description={
            snippets.length === 0
              ? "Save your elevator pitch, follow-up templates, and interview answers once — reuse them everywhere."
              : "Try a different search or category."
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
}
