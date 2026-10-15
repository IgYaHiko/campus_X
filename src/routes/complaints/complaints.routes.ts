import { Router } from "express";
import * as complaintController from "../../controllers/complaints/complaint.controllers"


const router = Router();


// GET /api/v1/complaints
router.get("/", complaintController.listComplaints);

export default router;