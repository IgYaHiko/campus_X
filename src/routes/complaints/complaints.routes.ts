import { Router } from "express";
import * as complaintController from "../../controllers/complaints/complaint.controllers";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";

const router = Router();

/**
 * @openapi
 * /api/v1/complaints:
 *   get:
 *     tags: [Complaints]
 *     summary: List complaints (paginated, filterable)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, assigned, in_progress, resolved, rejected, closed]
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high, urgent]
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items: { $ref: '#/components/schemas/Complaint' }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     total: { type: integer }
 *                     totalPages: { type: integer }
 */
router.get("/", complaintController.listComplaints);

/**
 * @openapi
 * /api/v1/complaints:
 *   post:
 *     tags: [Complaints]
 *     summary: Create a new complaint
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, studentId, categorySlug, location]
 *             properties:
 *               title: { type: string, example: "Wi-Fi not working in Lab 204" }
 *               description: { type: string }
 *               studentId: { type: integer, example: 1 }
 *               categorySlug: { type: string, example: "wi-fi-issue" }
 *               location: { type: string, example: "Lab 204" }
 *               building: { type: string, example: "Academic Block A" }
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Complaint created
 */

// 🛡️ PROTECTED ROUTES:
// 1. Only students can create a complaint
router.post("/", requireAuth,complaintController.createComplaint);

/**
 * @openapi
 * /api/v1/complaints/{id}:
 *   get:
 *     tags: [Complaints]
 *     summary: Get a single complaint with comments, history, tags
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Complaint detail
 *       404:
 *         description: Not found
 */
router.get("/:id", complaintController.getComplaint);

/**
 * @openapi
 * /api/v1/complaints/{id}/status:
 *   patch:
 *     tags: [Complaints]
 *     summary: Update complaint status (state machine enforced)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [newStatus]
 *             properties:
 *               newStatus:
 *                 type: string
 *                 enum: [open, assigned, in_progress, resolved, rejected, closed]
 *               changedByStaffId: { type: integer }
 *               note: { type: string }
 *               resolutionNote: { type: string }
 *               assignedStaffId: { type: integer }
 *     responses:
 *       200:
 *         description: Status updated
 */
// 2. Only staff and admins can update status
router.patch(
    "/:id/status",
    requireAuth,
    requireRole("staff", "admin"), 
    complaintController.updateComplaintStatus
);

/**
 * @openapi
 * /api/v1/complaints/{id}/comments:
 *   post:
 *     tags: [Complaints]
 *     summary: Add a comment to a complaint
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [commenterType, body]
 *             properties:
 *               commenterType: { type: string, enum: [student, staff] }
 *               studentId: { type: integer }
 *               staffId: { type: integer }
 *               body: { type: string }
 *     responses:
 *       201:
 *         description: Comment created
 */
// 3. Anyone logged in can comment
router.post(
    "/:id/comments", 
    requireAuth,
    complaintController.createComment
);

/**
 * @openapi
 * /api/v1/complaints/{id}/tags:
 *   post:
 *     tags: [Complaints]
 *     summary: Attach a tag by slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [tagSlug]
 *             properties:
 *               tagSlug: { type: string, example: "safety" }
 *     responses:
 *       201:
 *         description: Tag attached
 */
// 4. Only staff and admins can attach/detach tags
router.post("/:id/tags",
    requireAuth,
    requireRole("staff","admin"),
     complaintController.attachTags);

/**
 * @openapi
 * /api/v1/complaints/{id}/tags/{tagSlug}:
 *   delete:
 *     tags: [Complaints]
 *     summary: Detach a tag by slug
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: tagSlug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tag detached
 */
router.delete(
    "/:id/tags/:tagSlug",
    requireAuth, 
    requireRole("staff","admin"),
    complaintController.detachTags);

/**
 * @openapi
 * /api/v1/complaints/{id}/assign:
 *   post:
 *     tags: [Complaints]
 *     summary: Assign complaint to staff via Stored Procedure
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [staffEmail, adminEmail]
 *             properties:
 *               staffEmail: { type: string, example: "rakesh.kumar@campusfix.edu" }
 *               adminEmail: { type: string, example: "lakshmi.pillai@campusfix.edu" }
 *     responses:
 *       200:
 *         description: Assigned successfully
 */
router.post(
    "/:id/assign",
    requireAuth,
    requireRole("admin"),
    complaintController.assignComplaint);

export default router;