"use client";

import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { format, isPast } from "date-fns";
import { ArrowUpDown, Check, ExternalLink, Mail } from "lucide-react";
import { toast } from "sonner";

import { markContacted } from "@/features/contacts/actions/mark-contacted";
import type { ContactRow } from "@/features/contacts/queries/get-contacts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const helper = createColumnHelper<ContactRow>();

function SortButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-2 h-7 gap-1 px-2"
      onClick={onClick}
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </Button>
  );
}

const columns = [
  helper.accessor("name", {
    header: ({ column }) => (
      <SortButton
        label="Name"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        {row.original.title && (
          <div className="text-muted-foreground text-xs">
            {row.original.title}
          </div>
        )}
      </div>
    ),
  }),
  helper.accessor((row) => row.application.company.name, {
    id: "company",
    header: ({ column }) => (
      <SortButton
        label="Company"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ row }) => (
      <div>
        <div>{row.original.application.company.name}</div>
        <div className="text-muted-foreground text-xs">
          {row.original.application.title}
        </div>
      </div>
    ),
  }),
  helper.display({
    id: "links",
    header: "Reach",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {row.original.email && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            nativeButton={false}
            render={<a href={`mailto:${row.original.email}`} />}
          >
            <Mail className="size-3.5" />
            <span className="sr-only">Email {row.original.name}</span>
          </Button>
        )}
        {row.original.linkedin && (
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            nativeButton={false}
            render={
              <a
                href={row.original.linkedin}
                target="_blank"
                rel="noreferrer"
              />
            }
          >
            <ExternalLink className="size-3.5" />
            <span className="sr-only">LinkedIn profile</span>
          </Button>
        )}
      </div>
    ),
  }),
  helper.accessor("lastContacted", {
    header: ({ column }) => (
      <SortButton
        label="Last contacted"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ getValue }) => {
      const value = getValue();
      return value ? (
        <span className="text-sm">{format(value, "MMM d, yyyy")}</span>
      ) : (
        <span className="text-muted-foreground text-sm">never</span>
      );
    },
  }),
  helper.accessor("followUp", {
    header: ({ column }) => (
      <SortButton
        label="Follow up"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      />
    ),
    cell: ({ getValue }) => {
      const value = getValue();
      if (!value) return <span className="text-muted-foreground text-sm">—</span>;
      const overdue = isPast(value);
      return (
        <Badge variant={overdue ? "destructive" : "outline"}>
          {format(value, "MMM d, yyyy")}
        </Badge>
      );
    },
  }),
  helper.display({
    id: "actions",
    header: "",
    cell: ({ row }) => <MarkContactedButton id={row.original.id} />,
  }),
];

function MarkContactedButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        const result = await markContacted({ id });
        setPending(false);
        if (result.success) toast.success("Marked as contacted");
        else toast.error(result.error);
      }}
    >
      <Check className="size-3.5" />
      Contacted
    </Button>
  );
}

export function ContactsTable({ contacts }: { contacts: ContactRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: contacts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
