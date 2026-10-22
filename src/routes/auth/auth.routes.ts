import { Router } from "express";
import * as RegisterAuthController from "../../controllers/auth/register.controller";


const router = Router();

router.post("/register", RegisterAuthController.register);

export default router;