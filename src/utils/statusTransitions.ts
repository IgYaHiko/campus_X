export type ComplaintStatus =
  | "open"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "closed";

const TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  open: ["assigned", "rejected", "closed"],
  assigned: ["in_progress", "rejected"],
  in_progress: ["resolved", "rejected"],
  resolved: ["closed"],
  rejected: ["closed"],
  closed: [],
};

export function canTransition(
  from: ComplaintStatus,
  to: ComplaintStatus
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function allowedNext(from: ComplaintStatus): ComplaintStatus[] {
  return TRANSITIONS[from] ?? [];
}