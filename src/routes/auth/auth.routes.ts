import { Router } from "express";
import * as RegisterAuthController from "../../controllers/auth/register.controller";
import * as LoginAuthController from "../../controllers/auth/login.controller";
import * as GoogleAuthController from "../../controllers/auth/google.controller";
const router = Router();

router.post("/register", RegisterAuthController.register);
router.post("/login", LoginAuthController.login);
router.post("/google", GoogleAuthController.googleLogin);

export default router;