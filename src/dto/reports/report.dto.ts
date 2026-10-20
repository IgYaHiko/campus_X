export interface DepartmentWorkload {
    departmentId: number | null;
    departmentName: string | null;
    totalComplaints: number;
    openComplaints: number;
    resolvedComplaints: number;
    avgResolutionHours: number | null;
}

export interface SystemStats {
  totalComplaints: number;
  openComplaints: number;
  resolvedComplaints: number;
  urgentComplaints: number;
  avgResolutionHours: number | null;
}