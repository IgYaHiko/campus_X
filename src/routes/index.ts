import { Router } from "express";
import complaintRoutes from "./complaints/complaints.routes";
import categoriesRoutes from "./categories/categories.routes";
import tagsRoutes from "./tags/tags.routes"
import reportRoutes from "./reports/reports.routes";
import authRoutes from "./auth/auth.routes";
const router = Router();

router.use("/complaints", complaintRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tags", tagsRoutes);
router.use("/reports", reportRoutes);
router.use("/auth", authRoutes);

export default router;