import type { ApplicationStatus, Priority } from "@/lib/generated/prisma/enums";

export type BoardApplication = {
  id: string;
  title: string;
  status: ApplicationStatus;
  priority: Priority;
  position: number;
  location: string | null;
  remote: boolean;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string | null;
  appliedAt: Date | null;
  createdAt: Date;
  company: {
    id: string;
    name: string;
  };
};
