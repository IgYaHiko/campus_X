import { Router } from "express";
import complaintRoutes from "./complaints/complaints.routes";
import categoriesRoutes from "./categories/categories.routes";
import tagsRoutes from "./tags/tags.routes"
const router = Router();

router.use("/complaints", complaintRoutes);
router.use("/categories", categoriesRoutes);
router.use("/tags", tagsRoutes);

export default router;