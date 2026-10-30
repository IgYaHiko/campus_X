import { Router } from "express";
import * as categoryController from "../../controllers/categories/category.controller";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";

const router = Router();

/**
 * @openapi
 * /api/v1/categories:
 *   get:
 *     tags: [Categories]
 *     summary: List all active categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer }
 *                       slug: { type: string, example: "wi-fi-issue" }
 *                       name: { type: string }
 *                       defaultDepartmentId: { type: integer, nullable: true }
 */
router.get("/", categoryController.listCategories);



router.post(
    "/",
    requireAuth,
    requireRole("admin"),
    categoryController.createCategory
);

export default router;