import { Router } from "express";
import * as complaintController from "../../controllers/complaints/complaint.controllers"

const router = Router();


// GET /api/v1/complaints
router.get("/", complaintController.listComplaints);

// Get /api/v1/complaints
router.post("/", complaintController.createComplaint);

// GET /api/v1/complaints/:id
router.get("/:id", complaintController.getComplaint); 


// PATCH route /api/v1/complaints
router.patch("/:id/status", complaintController.updateComplaintStatus);

router.post("/:id/comments", complaintController.createComment);


export default router;