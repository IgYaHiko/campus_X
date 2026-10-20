-- =====================================================================
-- Migration: 0003_create_view_department_workload
-- Description: Creates a view to simplify department statistics.
-- =====================================================================

CREATE OR REPLACE VIEW `v_department_workload` AS
SELECT 
    d.id AS department_id,
    d.name AS department_name,
    COUNT(c.id) AS total_complaints,
    COALESCE(SUM(CASE WHEN c.status IN ('open', 'assigned', 'in_progress') THEN 1 ELSE 0 END), 0) AS open_complaints,
    COALESCE(SUM(CASE WHEN c.status IN ('resolved', 'closed') THEN 1 ELSE 0 END), 0) AS resolved_complaints,
    ROUND(
        AVG(
            CASE 
                WHEN c.status IN ('resolved', 'closed') AND c.resolved_at IS NOT NULL 
                THEN TIMESTAMPDIFF(HOUR, c.created_at, c.resolved_at) 
                ELSE NULL 
            END
        ), 1
    ) AS avg_resolution_hours
FROM `departments` d
LEFT JOIN `complaints` c ON c.department_id = d.id
GROUP BY d.id, d.name;