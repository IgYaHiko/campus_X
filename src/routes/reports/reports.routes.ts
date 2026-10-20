import {Router} from "express";
import * as reportController from "../../controllers/reports/report.controller";

const router = Router();


router.get("/departments", reportController.getDepartmentWorkload);
router.get("/system",reportController.getSystemStats);


export default router;