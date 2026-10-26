import { Router } from "express";
import complaintRoutes from "./complaints/complaints.routes";
import categoriesRoutes from "./categories/categories.routes";
import tagsRoutes from "./tags/tags.routes"
import reportRoutes from "./reports/reports.routes";
import authRoutes from "./auth/auth.routes";
import profileRoutes from "./student/student.routes"
const router = Router();

router.use("/complaints", complaintRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tags", tagsRoutes);
router.use("/reports", reportRoutes);
router.use("/auth", authRoutes);
router.use("/student",profileRoutes)

export default router;