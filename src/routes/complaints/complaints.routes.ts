import { Router } from "express";
import * as complaintController from "../../controllers/complaints/complaint.controllers"

const router = Router();


// GET /api/v1/complaints
router.get("/", complaintController.listComplaints);

// Get /api/v1/complaints
router.post("/", complaintController.createComplaint);

// GET /api/v1/complaints/:id
router.get("/:id", complaintController.getComplaint); 





export default router;