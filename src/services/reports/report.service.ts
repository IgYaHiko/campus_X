import { sql } from "drizzle-orm";
import { db } from "../../db/client";
import { DepartmentWorkload, SystemStats } from "../../dto/reports/report.dto";
import { complaints } from "../../db/schema/complaints";


export async function getDepartmentWorkload(): Promise<DepartmentWorkload[]> {
  const result = await db.execute(
    sql`SELECT * FROM v_department_workload ORDER BY total_complaints DESC`
  );

  // mysql2-based Drizzle returns SELECT rows in the first tuple element.
  const rows = (result as unknown as [Record<string, unknown>[], unknown])[0];

  return rows.map((r) => ({
    departmentId: Number(r.department_id),
    departmentName: String(r.department_name),
    totalComplaints: Number(r.total_complaints ?? 0),
    openComplaints: Number(r.open_complaints ?? 0),
    resolvedComplaints: Number(r.resolved_complaints ?? 0),
    avgResolutionHours:
      r.avg_resolution_hours == null
        ? null
        : Number(r.avg_resolution_hours),
  }));
}


export async function getSystemStats(): Promise<SystemStats> {

    const [row] = await db.select({
        totalComplaints: sql<number>`COUNT(*)`,
        openComplaints: sql<number>`SUM(CASE WHEN ${complaints.status} IN ('open', 'assigned', 'in_progress') THEN 1 ELSE 0 END)`,
        resolvedComplaints: sql<number>`SUM(CASE WHEN ${complaints.status} IN ('resolved', 'closed') THEN 1 ELSE 0 END)`,
        urgentComplaints: sql<number>`SUM(CASE WHEN ${complaints.priority} = 'urgent' AND ${complaints.status} NOT IN ('resolved', 'closed') THEN 1 ELSE 0 END)`,
        avgResolutionHours: sql<number | null>`
        ROUND(
          AVG(
            CASE 
              WHEN ${complaints.resolvedAt} IS NOT NULL 
              THEN TIMESTAMPDIFF(HOUR, ${complaints.createdAt}, ${complaints.resolvedAt}) 
              ELSE NULL 
            END
          ), 1
        )
      `,

    })
    .from(complaints)
    return {
        totalComplaints: Number(row.totalComplaints) || 0,
    openComplaints: Number(row.openComplaints) || 0,
    resolvedComplaints: Number(row.resolvedComplaints) || 0,
    urgentComplaints: Number(row.urgentComplaints) || 0,
    avgResolutionHours: row.avgResolutionHours ? Number(row.avgResolutionHours) : null,
    };
}