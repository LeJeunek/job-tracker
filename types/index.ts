// Shared app-wide types. Feature-specific types live in features/<feature>/types.

// Re-export Prisma model types so app code imports from one place.
export type {
  User,
  Company,
  Application,
  Contact,
  Interview,
  Task,
  Document,
  Activity,
  Tag,
  Snippet,
} from "@/lib/generated/prisma/client";

export {
  ApplicationStatus,
  Priority,
  SnippetCategory,
  ActivityType,
  DocumentType,
} from "@/lib/generated/prisma/enums";

/** Standard result shape returned by Server Actions. */
export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };
