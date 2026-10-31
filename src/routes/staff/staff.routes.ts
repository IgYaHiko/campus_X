import { Router } from "express";
import * as StaffController from "../../controllers/staff/staff.controller"
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { staff } from "../../db/schema/staff";
import { db } from "../../db/client";
import { and, eq } from "drizzle-orm";
const router = Router();


router.get(
    "/", 
    requireAuth,
    requireRole("admin"),
    StaffController.getAllStaff
    )

    router.get(
  "/admins",
  requireAuth,
  requireRole("admin"),
  async (_req, res, next) => {
    try {
      const data = await db
        .select({
          id: staff.id,
          name: staff.name,
          email: staff.email,
          role: staff.role,
          isActive: staff.isActive,
          createdAt: staff.createdAt,
        })
        .from(staff)
        .where(and(eq(staff.role, "admin"), eq(staff.isActive, true)));

      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
);


export default router