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
// POST route /api/v1/comments
router.post("/:id/comments", complaintController.createComment);

// POST routes /api/v1/:id/tags
router.post("/:id/tags", complaintController.attachTags);

// DELETE routes /api/v1/:id/tags/:tagSlug
router.delete("/:id/tags/:tagSlug", complaintController.detachTags); 

router.post("/:id/assign", complaintController.assignComplaint);




export default router;