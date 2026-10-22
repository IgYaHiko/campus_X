import { Router } from "express";
import * as reportController from "../../controllers/reports/report.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/reports/system:
 *   get:
 *     tags: [Reports]
 *     summary: System-wide aggregate stats (Total, Open, Resolved, Avg Time)
 *     responses:
 *       200:
 *         description: Aggregate counts and average resolution time
 */
router.get("/system", reportController.getSystemStats);

/**
 * @openapi
 * /api/v1/reports/departments:
 *   get:
 *     tags: [Reports]
 *     summary: Per-department workload (from SQL VIEW)
 *     responses:
 *       200:
 *         description: Workload per department
 */
router.get("/departments", reportController.getDepartmentWorkload);

/**
 * @openapi
 * /api/v1/reports/analytics/unassigned-staff:
 *   get:
 *     tags: [Reports]
 *     summary: Find staff members who have never been assigned a complaint
 *     responses:
 *       200:
 *         description: List of unassigned staff
 */
router.get("/analytics/unassigned-staff", reportController.getUnassignedStaff);

/**
 * @openapi
 * /api/v1/reports/analytics/silent-students:
 *   get:
 *     tags: [Reports]
 *     summary: Find students who filed a complaint but never commented
 *     responses:
 *       200:
 *         description: List of silent students
 */
router.get("/analytics/silent-students", reportController.getSilentStudents);

/**
 * @openapi
 * /api/v1/reports/analytics/high-volume-categories:
 *   get:
 *     tags: [Reports]
 *     summary: Find categories with more than 2 complaints
 *     responses:
 *       200:
 *         description: List of high-volume categories
 */
router.get(
  "/analytics/high-volume-categories",
  reportController.getHighVolumeCategories
);

export default router;