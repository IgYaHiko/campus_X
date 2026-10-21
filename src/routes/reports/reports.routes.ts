import {Router} from "express";
import * as reportController from "../../controllers/reports/report.controller";

const router = Router();


router.get("/departments", reportController.getDepartmentWorkload);
router.get("/system",reportController.getSystemStats);
router.get("/analytics/unassigned-staff", reportController.getUnassignedStaff);
router.get("/analytics/silent-students", reportController.getSilentStudents);
router.get("/analytics/high-volume-categories", reportController.getHighVolumeCategories);
export default router;