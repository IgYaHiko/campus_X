import { Router } from "express";
import * as tagController from "../../controllers/tags/tag.controller";

const router = Router();

/**
 * @openapi
 * /api/v1/tags:
 *   get:
 *     tags: [Tags]
 *     summary: List all tags
 *     responses:
 *       200:
 *         description: List of tags
 */
router.get("/", tagController.listTags);

export default router;