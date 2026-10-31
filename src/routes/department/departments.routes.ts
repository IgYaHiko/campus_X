import { Router } from "express";
import { db } from "../../db/client";
import { departments } from "../../db/schema/department";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import * as departmentController from "../../controllers/department/department.controller"
const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const data = await db.select().from(departments);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
});


// Only admins can create new departments
router.post(
  "/",
  requireAuth,
  requireRole("admin"),
  departmentController.createDepartment
);


export default router;