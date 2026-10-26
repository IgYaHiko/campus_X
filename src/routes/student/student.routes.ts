import { Router } from "express";
import * as studentController from "../../controllers/student/student.controller";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";

const router = Router();

// Protect all routes in this file
router.use(requireAuth, requireRole("student"));

router.get("/me", studentController.getMyProfile);
router.patch("/update-me", studentController.updateMyProfile);

export default router;