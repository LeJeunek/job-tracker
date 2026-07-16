import type { SnippetCategory } from "@/lib/generated/prisma/enums";

export const CATEGORY_LABELS: Record<SnippetCategory, string> = {
  INTRO: "Intro",
  BEHAVIORAL: "Behavioral",
  TECHNICAL: "Technical",
  FOLLOW_UP: "Follow up",
  THANK_YOU: "Thank you",
  COVER_LETTER: "Cover letter",
  NEGOTIATION: "Negotiation",
  OTHER: "Other",
};
