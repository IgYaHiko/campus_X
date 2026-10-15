import { Router } from "express";
import complaintRoutes from "./complaints/complaints.routes";

const router = Router();

router.use("/complaints", complaintRoutes);

export default router;