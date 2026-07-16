import { ApplicationStatus, Priority } from "@/lib/generated/prisma/enums";

export type BoardColumn = {
  status: ApplicationStatus;
  label: string;
  /** Tailwind class for the column's status dot */
  dot: string;
};

export const BOARD_COLUMNS: BoardColumn[] = [
  { status: "WISHLIST", label: "Wishlist", dot: "bg-slate-400" },
  { status: "SAVED", label: "Saved", dot: "bg-zinc-400" },
  { status: "APPLIED", label: "Applied", dot: "bg-blue-500" },
  { status: "RECRUITER_SCREEN", label: "Recruiter Screen", dot: "bg-cyan-500" },
  { status: "PHONE_SCREEN", label: "Phone Screen", dot: "bg-teal-500" },
  { status: "TECHNICAL", label: "Technical", dot: "bg-indigo-500" },
  { status: "ONSITE", label: "Onsite", dot: "bg-violet-500" },
  { status: "FINAL_ROUND", label: "Final Round", dot: "bg-purple-500" },
  { status: "OFFER", label: "Offer", dot: "bg-amber-500" },
  { status: "ACCEPTED", label: "Accepted", dot: "bg-green-500" },
  { status: "REJECTED", label: "Rejected", dot: "bg-red-500" },
  { status: "WITHDRAWN", label: "Withdrawn", dot: "bg-stone-500" },
];

export function statusLabel(status: ApplicationStatus) {
  return BOARD_COLUMNS.find((c) => c.status === status)?.label ?? status;
}

export const PRIORITY_STYLES: Record<Priority, string> = {
  LOW: "bg-muted text-muted-foreground",
  MEDIUM: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  HIGH: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  URGENT: "bg-red-500/15 text-red-700 dark:text-red-400",
};
