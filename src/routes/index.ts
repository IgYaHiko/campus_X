import { Router } from "express";
import complaintRoutes from "./complaints/complaints.routes";
import categoriesRoutes from "./categories/categories.routes";

const router = Router();

router.use("/complaints", complaintRoutes);
router.use("/categories", categoriesRoutes);

export default router;