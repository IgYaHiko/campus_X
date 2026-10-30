import { Router } from "express";
import * as StaffController from "../../controllers/staff/staff.controller"
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
const router = Router();


router.get(
    "/", 
    requireAuth,
    requireRole("admin"),
    StaffController.getAllStaff
    )


export default router