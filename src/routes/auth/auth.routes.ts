import { Router } from "express";
import * as RegisterAuthController from "../../controllers/auth/register.controller";
import * as LoginAuthController from "../../controllers/auth/login.controller";
import * as GoogleAuthController from "../../controllers/auth/google.controller";
import { requireAuth } from "../../middlewares/requireAuth";
import * as HandoffController from "../../controllers/auth/handoff.controller"
const router = Router();


router.post(
  "/handoff",
  requireAuth,
  HandoffController.generateHandoff
);

router.post(
  "/handoff/exchange",
  HandoffController.exchangeHandoffCode
);


router.post("/register", RegisterAuthController.register);
router.post("/login", LoginAuthController.login);
router.post("/google", GoogleAuthController.googleLogin);

export default router;